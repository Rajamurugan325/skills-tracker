package com.codepilot.service.impl;

import com.codepilot.entity.Question;
import com.codepilot.entity.Topic;
import com.codepilot.entity.User;
import com.codepilot.entity.QuizAnswer;
import com.codepilot.entity.UserTopicProgress;
import com.codepilot.repository.QuestionRepository;
import com.codepilot.repository.TopicRepository;
import com.codepilot.repository.UserTopicProgressRepository;
import com.codepilot.repository.QuizAnswerRepository;
import com.codepilot.service.AdaptiveEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdaptiveEngineServiceImpl implements AdaptiveEngineService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserTopicProgressRepository userTopicProgressRepository;

    @Autowired
    private QuizAnswerRepository quizAnswerRepository;

    @Override
    public List<Question> selectQuestions(User user, String category, int count) {
        // 1. Get all topics for the selected category (or all if category is null/empty)
        List<Topic> topics;
        if (category != null && !category.trim().isEmpty()) {
            topics = topicRepository.findByCategory(category.toUpperCase().trim());
        } else {
            topics = topicRepository.findAll();
        }

        if (topics.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Fetch user's topic progress
        List<UserTopicProgress> progresses = userTopicProgressRepository.findByUserId(user.getId());
        Map<Long, Double> accuracyMap = progresses.stream()
                .collect(Collectors.toMap(p -> p.getTopic().getId(), UserTopicProgress::getAccuracyPercentage));

        // 3. Assign priority weights based on accuracy
        // Accuracy < 50% = HIGH (weight 60)
        // Accuracy 50-70% = MEDIUM (weight 30)
        // Accuracy > 70% = LOW (weight 10)
        // Unattempted = HIGH (weight 60)
        Map<Topic, Integer> topicWeights = new HashMap<>();
        int totalWeight = 0;
        for (Topic t : topics) {
            Double accuracy = accuracyMap.get(t.getId());
            int weight;
            if (accuracy == null) {
                weight = 60; // Unattempted (High Priority)
            } else if (accuracy < 50.0) {
                weight = 60; // High Priority
            } else if (accuracy <= 70.0) {
                weight = 30; // Medium Priority
            } else {
                weight = 10; // Low Priority
            }
            topicWeights.put(t, weight);
            totalWeight += weight;
        }

        // 4. Fetch the last 20 question IDs answered by user to avoid repetition
        List<Long> recentQuestionIds = quizAnswerRepository.findRecentQuestionIds(user.getId(), PageRequest.of(0, 20));
        Set<Long> excludedIds = new HashSet<>(recentQuestionIds);

        List<Question> selectedQuestions = new ArrayList<>();
        Random random = new Random();

        // 5. Select 'count' questions
        for (int i = 0; i < count; i++) {
            // Select topic using weighted probability (roulette wheel)
            Topic selectedTopic = selectTopicWeighted(topicWeights, totalWeight, random);
            if (selectedTopic == null) {
                break;
            }

            // Determine difficulty for this topic based on the user's last answers
            String targetDifficulty = determineTargetDifficulty(user.getId(), selectedTopic.getId());

            // Build the set of all excluded question IDs (recent + already selected in this session)
            Set<Long> allExcluded = new HashSet<>(excludedIds);
            selectedQuestions.forEach(q -> allExcluded.add(q.getId()));
            Collection<Long> excludeList = allExcluded.isEmpty() ? Collections.singleton(-1L) : allExcluded;

            // Attempt to get random question matching topic and difficulty
            Optional<Question> questionOpt = questionRepository.findRandomByTopicIdAndDifficultyExcluding(
                    selectedTopic.getId(), targetDifficulty, excludeList);

            if (questionOpt.isPresent()) {
                selectedQuestions.add(questionOpt.get());
            } else {
                // Fallback 1: Try other difficulties in the same topic
                Optional<Question> fallback1Opt = questionRepository.findRandomByTopicIdExcluding(
                        selectedTopic.getId(), excludeList);
                if (fallback1Opt.isPresent()) {
                    selectedQuestions.add(fallback1Opt.get());
                } else {
                    // Fallback 2: Try any question in the category
                    Optional<Question> fallback2Opt = questionRepository.findRandomByCategoryExcluding(
                            category, excludeList);
                    fallback2Opt.ifPresent(selectedQuestions::add);
                }
            }
        }

        return selectedQuestions;
    }

    private Topic selectTopicWeighted(Map<Topic, Integer> weights, int totalWeight, Random random) {
        if (totalWeight <= 0 || weights.isEmpty()) {
            return null;
        }
        int randVal = random.nextInt(totalWeight);
        int cursor = 0;
        for (Map.Entry<Topic, Integer> entry : weights.entrySet()) {
            cursor += entry.getValue();
            if (randVal < cursor) {
                return entry.getKey();
            }
        }
        return weights.keySet().iterator().next();
    }

    String determineTargetDifficulty(Long userId, Long topicId) {
        // Fetch the last 3 answers for this topic
        List<QuizAnswer> lastAnswers = quizAnswerRepository.findLastAnswersByTopic(userId, topicId, PageRequest.of(0, 3));
        
        if (lastAnswers.isEmpty()) {
            return "EASY"; // Default if new
        }

        // Rule: If last 3 answers were correct -> go up
        // Rule: If last 2 answers were incorrect -> go down
        boolean allCorrectLast3 = lastAnswers.size() == 3 && lastAnswers.stream().allMatch(QuizAnswer::isCorrect);
        boolean last2Incorrect = lastAnswers.size() >= 2 && !lastAnswers.get(0).isCorrect() && !lastAnswers.get(1).isCorrect();

        String currentDiff = lastAnswers.get(0).getQuestion().getDifficulty();

        if (allCorrectLast3) {
            if ("EASY".equals(currentDiff)) {
                return "MEDIUM";
            } else if ("MEDIUM".equals(currentDiff)) {
                return "HARD";
            }
        } else if (last2Incorrect) {
            if ("HARD".equals(currentDiff)) {
                return "MEDIUM";
            } else if ("MEDIUM".equals(currentDiff)) {
                return "EASY";
            }
        }

        return currentDiff; // Remain at current difficulty
    }
}
