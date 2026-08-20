package com.codepilot.service.impl;

import com.codepilot.dto.ChatMessageDto;
import com.codepilot.entity.*;
import com.codepilot.exception.ResourceNotFoundException;
import com.codepilot.repository.*;
import com.codepilot.service.AiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiServiceImpl implements AiService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private WrongAnswerRepository wrongAnswerRepository;

    @Autowired
    private UserTopicProgressRepository userTopicProgressRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private MockInterviewRepository mockInterviewRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDto> getChatHistory(Long userId) {
        return chatMessageRepository.findByUserIdOrderByCreatedAtAsc(userId).stream()
                .map(msg -> ChatMessageDto.builder()
                        .message(msg.getMessage())
                        .sender(msg.getSender())
                        .timestamp(msg.getCreatedAt().format(formatter))
                        .fileUrl(msg.getFileUrl())
                        .fileType(msg.getFileType())
                        .fileName(msg.getFileName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageDto chat(Long userId, String userMessage, String fileUrl, String fileType, String fileName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 1. Save user's message
        ChatMessage userChat = ChatMessage.builder()
                .user(user)
                .message(userMessage)
                .sender("USER")
                .fileUrl(fileUrl)
                .fileType(fileType)
                .fileName(fileName)
                .build();
        chatMessageRepository.save(userChat);

        // 2. Perform RAG context retrieval
        String ragContext = gatherRagContext(userId, userMessage);

        // 3. Generate response using online LLM or offline local RAG engine
        String aiResponseText;
        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey != null && !apiKey.trim().isEmpty()) {
            aiResponseText = generateWithGemini(userMessage, ragContext, apiKey);
        } else {
            aiResponseText = generateWithLocalEngine(userMessage, ragContext, userId);
        }

        // 4. Save AI response
        ChatMessage aiChat = ChatMessage.builder()
                .user(user)
                .message(aiResponseText)
                .sender("AI")
                .build();
        ChatMessage savedAiChat = chatMessageRepository.save(aiChat);

        return ChatMessageDto.builder()
                .message(savedAiChat.getMessage())
                .sender(savedAiChat.getSender())
                .timestamp(savedAiChat.getCreatedAt().format(formatter))
                .fileUrl(savedAiChat.getFileUrl())
                .fileType(savedAiChat.getFileType())
                .fileName(savedAiChat.getFileName())
                .build();
    }

    private String gatherRagContext(Long userId, String query) {
        StringBuilder context = new StringBuilder();

        // Extract search terms
        String[] words = query.toLowerCase().replaceAll("[^a-zA-Z0-9 ]", "").split("\\s+");
        Set<String> searchTerms = Arrays.stream(words)
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());

        // Find relevant questions in database
        List<Question> matchingQuestions = new ArrayList<>();
        for (String term : searchTerms) {
            matchingQuestions.addAll(questionRepository.searchByKeyword(term));
        }

        // Remove duplicates and limit to 5
        List<Question> uniqueQuestions = matchingQuestions.stream()
                .distinct()
                .limit(5)
                .collect(Collectors.toList());

        if (!uniqueQuestions.isEmpty()) {
            context.append("### Retrieved Relevant Platform Questions & Explanations:\n");
            for (Question q : uniqueQuestions) {
                context.append(String.format("- **Topic**: %s | **Question**: %s\n", q.getTopic().getName(), q.getQuestionText()));
                context.append(String.format("  - Options: A) %s | B) %s | C) %s | D) %s\n", q.getOptionA(), q.getOptionB(), q.getOptionC(), q.getOptionD()));
                context.append(String.format("  - Correct Answer: %s | Explanation: %s\n\n", q.getCorrectAnswer(), q.getExplanation()));
            }
        }

        // Fetch user's incorrect answers
        List<WrongAnswer> wrongAnswers = wrongAnswerRepository.findByUserId(userId);
        if (!wrongAnswers.isEmpty()) {
            context.append("### Candidate's Weakness History & Mistakes:\n");
            int mistakeLimit = 0;
            for (WrongAnswer wa : wrongAnswers) {
                if (mistakeLimit >= 5) break;
                // Check if this wrong answer matches query keywords
                boolean matchesKeyword = searchTerms.isEmpty() || searchTerms.stream()
                        .anyMatch(term -> wa.getQuestion().getQuestionText().toLowerCase().contains(term)
                                || wa.getTopic().getName().toLowerCase().contains(term));

                if (matchesKeyword) {
                    context.append(String.format("- Struggle Area in **%s**:\n", wa.getTopic().getName()));
                    context.append(String.format("  - Question: \"%s\"\n", wa.getQuestion().getQuestionText()));
                    context.append(String.format("  - Candidate's wrong answer: %s | Correct answer: %s\n", wa.getSelectedAnswer(), wa.getCorrectAnswer()));
                    context.append(String.format("  - Explanation: %s\n\n", wa.getQuestion().getExplanation()));
                    mistakeLimit++;
                }
            }
        }

        // Fetch user topic progress for context
        List<UserTopicProgress> progresses = userTopicProgressRepository.findByUserId(userId);
        List<UserTopicProgress> strugglingTopics = progresses.stream()
                .filter(p -> p.getAccuracyPercentage() < 60.0)
                .limit(3)
                .collect(Collectors.toList());

        if (!strugglingTopics.isEmpty()) {
            context.append("### Candidate's Overall Low Accuracy Areas (<60%):\n");
            for (UserTopicProgress p : strugglingTopics) {
                context.append(String.format("- **%s**: Accuracy %.1f%% (%d/%d correct)\n", 
                        p.getTopic().getName(), p.getAccuracyPercentage(), p.getCorrectCount(), p.getTotalCount()));
            }
        }

        // Calculate Consistency Score for RAG Context
        java.time.LocalDateTime cutoff = java.time.LocalDateTime.now().minusDays(14);
        List<QuizAttempt> recentQuizzes = quizAttemptRepository.findByUserId(userId).stream()
                .filter(q -> q.getStartTime().isAfter(cutoff))
                .collect(Collectors.toList());
        List<MockInterview> recentMocks = mockInterviewRepository.findByUserId(userId).stream()
                .filter(m -> m.getStartTime().isAfter(cutoff))
                .collect(Collectors.toList());

        Set<java.time.LocalDate> activeDates = new HashSet<>();
        recentQuizzes.forEach(q -> activeDates.add(q.getStartTime().toLocalDate()));
        recentMocks.forEach(m -> activeDates.add(m.getStartTime().toLocalDate()));

        int activeDays = activeDates.size();
        double consistencyScore = Math.min(100.0, (activeDays / 7.0) * 100.0);
        double finalConsistency = Math.round(consistencyScore * 10.0) / 10.0;
        
        context.append("### Candidate's Consistency Mode Stats:\n");
        context.append(String.format("- **Consistency Mode Status**: Active\n"));
        context.append(String.format("- **Active Days (Last 14 Days)**: %d days\n", activeDays));
        context.append(String.format("- **Consistency Score**: %.1f%%\n\n", finalConsistency));

        return context.toString();
    }

    private String generateWithGemini(String userPrompt, String ragContext, String apiKey) {
        String urlString = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String systemInstruction = "You are CodePilot AI, an intelligent Retrieval-Augmented Generation (RAG) study assistant. " +
                    "Your goal is to help software candidates analyze their performance, clarify programming/CS concepts, " +
                    "and review mistakes. You have access to the candidate's database context (retrieved questions, weak areas, " +
                    "wrong answers, and their Consistency Mode status/score). Use this context to personalize your answers. " +
                    "Specifically, if they ask about their consistency, streaks, or their active Consistency Mode, evaluate their active " +
                    "days and encourage them to maintain their streak! Render code snippets in standard markdown blocks.";

            String completePrompt = String.format("%s\n\nRAG DATABASE CONTEXT:\n%s\n\nUSER INQUIRY: %s", 
                    systemInstruction, ragContext, userPrompt);

            // Build request JSON
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", completePrompt);

            Map<String, Object> parts = new HashMap<>();
            parts.put("parts", Collections.singletonList(textPart));

            Map<String, Object> contents = new HashMap<>();
            contents.put("contents", Collections.singletonList(parts));

            String jsonPayload = objectMapper.writeValueAsString(contents);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
                    StringBuilder response = new StringBuilder();
                    String responseLine;
                    while ((responseLine = br.readLine()) != null) {
                        response.append(responseLine.trim());
                    }
                    JsonNode root = objectMapper.readTree(response.toString());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        return candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                    }
                }
            }
            return "Error calling Gemini API (Response Code: " + responseCode + "). Falling back to offline RAG mode:\n\n" 
                   + generateWithLocalEngine(userPrompt, ragContext, null);
        } catch (Exception e) {
            return "Gemini connection error: " + e.getMessage() + ". Falling back to offline RAG mode:\n\n" 
                   + generateWithLocalEngine(userPrompt, ragContext, null);
        }
    }

    private String generateWithLocalEngine(String userPrompt, String ragContext, Long userId) {
        StringBuilder response = new StringBuilder();
        String cleanPrompt = userPrompt.toLowerCase().trim();

        response.append("### 🤖 CodePilot Local RAG Assistant\n");
        response.append("> **Notice**: Running in **Offline RAG Mode**. Configure `GEMINI_API_KEY` in environment variables for online conversational intelligence.\n\n");

        if (cleanPrompt.contains("consistency") || cleanPrompt.contains("streak") || cleanPrompt.contains("active")) {
            response.append("Here is your **Consistency Mode analysis**:\n\n");
            if (ragContext.contains("Consistency Mode Stats")) {
                int startIdx = ragContext.indexOf("### Candidate's Consistency Mode Stats:");
                if (startIdx != -1) {
                    response.append(ragContext.substring(startIdx).replaceAll("###", "####"));
                }
            } else {
                response.append("- **Consistency Mode Status**: Active\n");
                response.append("- **Details**: You are actively practicing quizzes and mock sessions to improve your retention rates.\n");
            }
            response.append("\n**How Consistency Score works**:\n");
            response.append("- Your score is calculated based on how many distinct days in the last 14 days you completed at least one quiz or mock interview.\n");
            response.append("- Completing at least 7 active days of learning in the last two weeks brings your Consistency rating to **100%**.\n");
            response.append("- Maintain daily engagement to prevent your score from decaying and keep your overall readiness indicator high!");
        } else if (cleanPrompt.contains("weak") || cleanPrompt.contains("mistake") || cleanPrompt.contains("struggle") || cleanPrompt.contains("fail")) {
            response.append("Based on your platform history, I have analyzed your weak areas:\n\n");
            if (ragContext.contains("Struggle Area") || ragContext.contains("Low Accuracy Areas")) {
                response.append(ragContext.replaceAll("###", "####"));
                response.append("\n**Action Plan**:\n");
                response.append("1. **Review Explanations**: Read the correct concepts listed above.\n");
                response.append("2. **Targeted Quizzes**: Go to the **Practice Space** or **Quiz Lobby** and target these topics specifically.\n");
                response.append("3. **Mock Interviews**: Build custom Technical or Non-Technical sessions targeting only your weak skills to test your adaptation.");
            } else {
                response.append("Excellent work! You currently do not have any struggling topics (Accuracy < 60%) or logged wrong answers in your active topics. Keep practicing!");
            }
        } else if (cleanPrompt.contains("study") || cleanPrompt.contains("plan") || cleanPrompt.contains("path") || cleanPrompt.contains("learn")) {
            response.append("Here is your **Personalized Study Plan** generated from your current stats:\n\n");
            List<UserTopicProgress> progresses = userTopicProgressRepository.findByUserId(userId);
            if (!progresses.isEmpty()) {
                response.append("#### Your Current Priority Queue:\n");
                progresses.sort((p1, p2) -> Double.compare(p1.getAccuracyPercentage(), p2.getAccuracyPercentage()));
                int limit = 0;
                for (UserTopicProgress p : progresses) {
                    if (limit >= 3) break;
                    response.append(String.format("1. **%s** (Priority: High | Current Accuracy: %.1f%%)\n", p.getTopic().getName(), p.getAccuracyPercentage()));
                    response.append("   - Focus: Review core syntax and take 2 adaptive quizzes on this topic.\n");
                    limit++;
                }
            } else {
                response.append("1. **Core Programming**: Start by completing quizzes in Java, Python, or C tracks.\n");
                response.append("2. **CS Theory**: Once fundamentals are green, practice Databases (SQL/DBMS) and Web theory.\n");
            }
        } else {
            // Keyword based query
            response.append("I searched the platform database for your query. Here is what I retrieved:\n\n");
            if (ragContext.contains("Retrieved Relevant Platform Questions")) {
                response.append(ragContext.replaceAll("###", "####"));
            } else {
                response.append("No matching questions or topics found in the platform database for your specific search term. " +
                        "Try asking about topics like **Java**, **SQL**, **Data Structures (DSA)**, **Aptitude**, or **React**.");
            }
        }

        return response.toString();
    }
}
