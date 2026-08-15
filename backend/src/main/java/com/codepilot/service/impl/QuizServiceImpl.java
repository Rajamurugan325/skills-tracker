package com.codepilot.service.impl;

import com.codepilot.dto.*;
import com.codepilot.entity.*;
import com.codepilot.exception.BadRequestException;
import com.codepilot.exception.ResourceNotFoundException;
import com.codepilot.repository.*;
import com.codepilot.service.AdaptiveEngineService;
import com.codepilot.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizAnswerRepository quizAnswerRepository;

    @Autowired
    private WrongAnswerRepository wrongAnswerRepository;

    @Autowired
    private UserTopicProgressRepository userTopicProgressRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AdaptiveEngineService adaptiveEngineService;

    @Override
    @Transactional
    public QuizAttemptDto startQuiz(Long userId, QuizStartRequest startRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Question> selectedQuestions = new ArrayList<>();

        if (startRequest.getTopicId() != null) {
            // Student wants to practice a specific topic
            Topic topic = topicRepository.findById(startRequest.getTopicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + startRequest.getTopicId()));
            List<Question> questions = questionRepository.findByTopicId(topic.getId());
            if (questions.isEmpty()) {
                throw new BadRequestException("No questions available for topic: " + topic.getName());
            }
            // Shuffle and pick up to 10
            Collections.shuffle(questions);
            selectedQuestions = questions.stream().limit(10).collect(Collectors.toList());
        } else {
            // Adaptive mode or Category mode
            selectedQuestions = adaptiveEngineService.selectQuestions(user, startRequest.getCategory(), 10);
            if (selectedQuestions.isEmpty()) {
                // If adaptive returned nothing, pick any random questions from database
                List<Question> allQuestions = questionRepository.findAll();
                if (allQuestions.isEmpty()) {
                    throw new ResourceNotFoundException("No questions seeded in the database");
                }
                Collections.shuffle(allQuestions);
                selectedQuestions = allQuestions.stream().limit(10).collect(Collectors.toList());
            }
        }

        // Initialize Attempt
        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .totalQuestions(selectedQuestions.size())
                .score(0)
                .build();

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        // Map to secure DTO (excluding correct answer and explanations)
        List<QuizQuestionDto> quizQuestionDtos = selectedQuestions.stream()
                .map(q -> QuizQuestionDto.builder()
                        .id(q.getId())
                        .topicId(q.getTopic().getId())
                        .topicName(q.getTopic().getName())
                        .category(q.getTopic().getCategory())
                        .questionText(q.getQuestionText())
                        .optionA(q.getOptionA())
                        .optionB(q.getOptionB())
                        .optionC(q.getOptionC())
                        .optionD(q.getOptionD())
                        .difficulty(q.getDifficulty())
                        .build())
                .collect(Collectors.toList());

        // We temporarily save the selected questions in the attempt answers as blank entries or fetch them dynamically on submit.
        // To maintain standard JPA relational integrity, we can just save blank QuizAnswers first, linking questions to the attempt.
        for (Question q : selectedQuestions) {
            QuizAnswer qa = QuizAnswer.builder()
                    .quizAttempt(savedAttempt)
                    .question(q)
                    .selectedAnswer("")
                    .isCorrect(false)
                    .build();
            quizAnswerRepository.save(qa);
        }

        return QuizAttemptDto.builder()
                .attemptId(savedAttempt.getId())
                .userId(userId)
                .startTime(savedAttempt.getStartTime())
                .totalQuestions(savedAttempt.getTotalQuestions())
                .questions(quizQuestionDtos)
                .build();
    }

    @Override
    @Transactional
    public QuizResultDto submitQuiz(Long userId, QuizSubmitRequest submitRequest) {
        QuizAttempt attempt = quizAttemptRepository.findById(submitRequest.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz Attempt not found with id: " + submitRequest.getAttemptId()));

        if (!attempt.getUser().getId().equals(userId)) {
            throw new BadRequestException("This attempt does not belong to the logged-in user.");
        }

        if (attempt.getEndTime() != null) {
            throw new BadRequestException("This quiz has already been submitted.");
        }

        User user = attempt.getUser();
        int score = 0;
        List<QuizAnswerDetailDto> detailDtos = new ArrayList<>();

        // Map user submissions by question ID
        Map<Long, String> submissionMap = submitRequest.getAnswers().stream()
                .collect(Collectors.toMap(QuizAnswerSubmitDto::getQuestionId, QuizAnswerSubmitDto::getSelectedAnswer, (a, b) -> a));

        // Load quiz answers prepared during startQuiz
        List<QuizAnswer> answers = attempt.getAnswers();

        for (QuizAnswer answer : answers) {
            Question question = answer.getQuestion();
            String selected = submissionMap.getOrDefault(question.getId(), "").toUpperCase().trim();
            boolean isCorrect = selected.equals(question.getCorrectAnswer().toUpperCase().trim());

            answer.setSelectedAnswer(selected);
            answer.setCorrect(isCorrect);
            quizAnswerRepository.save(answer);

            if (isCorrect) {
                score++;
            } else {
                // Log in Wrong Answers table
                WrongAnswer wrong = WrongAnswer.builder()
                        .user(user)
                        .question(question)
                        .selectedAnswer(selected)
                        .correctAnswer(question.getCorrectAnswer())
                        .topic(question.getTopic())
                        .difficulty(question.getDifficulty())
                        .build();
                wrongAnswerRepository.save(wrong);
            }

            // Record progress & skills topic-wise
            updateProgressAndSkills(user, question.getTopic(), isCorrect);

            detailDtos.add(QuizAnswerDetailDto.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .optionA(question.getOptionA())
                    .optionB(question.getOptionB())
                    .optionC(question.getOptionC())
                    .optionD(question.getOptionD())
                    .selectedAnswer(selected)
                    .correctAnswer(question.getCorrectAnswer())
                    .explanation(question.getExplanation())
                    .isCorrect(isCorrect)
                    .build());
        }

        attempt.setScore(score);
        attempt.setEndTime(LocalDateTime.now());
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        return QuizResultDto.builder()
                .attemptId(savedAttempt.getId())
                .userId(userId)
                .score(savedAttempt.getScore())
                .totalQuestions(savedAttempt.getTotalQuestions())
                .startTime(savedAttempt.getStartTime())
                .endTime(savedAttempt.getEndTime())
                .answers(detailDtos)
                .build();
    }

    private void updateProgressAndSkills(User user, Topic topic, boolean isCorrect) {
        // 1. Update Topic Progress
        UserTopicProgress progress = userTopicProgressRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElseGet(() -> UserTopicProgress.builder()
                        .user(user)
                        .topic(topic)
                        .correctCount(0)
                        .totalCount(0)
                        .accuracyPercentage(0.0)
                        .build());

        progress.setTotalCount(progress.getTotalCount() + 1);
        if (isCorrect) {
            progress.setCorrectCount(progress.getCorrectCount() + 1);
        }
        // Triggers @PreUpdate/PrePersist to recalculate accuracy percentage
        UserTopicProgress savedProgress = userTopicProgressRepository.save(progress);

        // 2. Sync User Skill percentage
        UserSkill skill = userSkillRepository.findByUserIdAndTopicId(user.getId(), topic.getId())
                .orElseGet(() -> UserSkill.builder()
                        .user(user)
                        .topic(topic)
                        .skillLevelPercentage(0.0)
                        .build());

        skill.setSkillLevelPercentage(savedProgress.getAccuracyPercentage());
        userSkillRepository.save(skill);

        // 3. Update Recommendations
        if (savedProgress.getAccuracyPercentage() < 50.0 && savedProgress.getTotalCount() >= 3) {
            // Generate a recommendation
            boolean alreadyExists = recommendationRepository.findByUserId(user.getId()).stream()
                    .anyMatch(r -> r.getTopic().getId().equals(topic.getId()));
            if (!alreadyExists) {
                Recommendation rec = Recommendation.builder()
                        .user(user)
                        .topic(topic)
                        .actionMessage("Practice " + topic.getName() + " - Focus on Easy/Medium concepts to build foundation.")
                        .priority("HIGH")
                        .build();
                recommendationRepository.save(rec);
            }
        } else if (savedProgress.getAccuracyPercentage() >= 70.0) {
            // If they improved, remove the recommendation
            List<Recommendation> recs = recommendationRepository.findByUserId(user.getId());
            for (Recommendation r : recs) {
                if (r.getTopic().getId().equals(topic.getId())) {
                    recommendationRepository.delete(r);
                }
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizResultDto> getHistory(Long userId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByStartTimeDesc(userId);
        return attempts.stream()
                .filter(a -> a.getEndTime() != null) // Only return completed quizzes
                .map(a -> mapToResultDto(a))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuizResultDto getAttemptResult(Long userId, Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz Attempt not found with id: " + attemptId));

        if (!attempt.getUser().getId().equals(userId)) {
            throw new BadRequestException("This attempt does not belong to the logged-in user.");
        }

        return mapToResultDto(attempt);
    }

    private QuizResultDto mapToResultDto(QuizAttempt attempt) {
        List<QuizAnswerDetailDto> details = attempt.getAnswers().stream()
                .map(qa -> QuizAnswerDetailDto.builder()
                        .questionId(qa.getQuestion().getId())
                        .questionText(qa.getQuestion().getQuestionText())
                        .optionA(qa.getQuestion().getOptionA())
                        .optionB(qa.getQuestion().getOptionB())
                        .optionC(qa.getQuestion().getOptionC())
                        .optionD(qa.getQuestion().getOptionD())
                        .selectedAnswer(qa.getSelectedAnswer())
                        .correctAnswer(qa.getQuestion().getCorrectAnswer())
                        .explanation(qa.getQuestion().getExplanation())
                        .isCorrect(qa.isCorrect())
                        .build())
                .collect(Collectors.toList());

        return QuizResultDto.builder()
                .attemptId(attempt.getId())
                .userId(attempt.getUser().getId())
                .score(attempt.getScore())
                .totalQuestions(attempt.getTotalQuestions())
                .startTime(attempt.getStartTime())
                .endTime(attempt.getEndTime())
                .answers(details)
                .build();
    }
}
