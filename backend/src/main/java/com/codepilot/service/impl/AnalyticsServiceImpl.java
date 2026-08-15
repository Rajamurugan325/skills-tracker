package com.codepilot.service.impl;

import com.codepilot.dto.*;
import com.codepilot.entity.*;
import com.codepilot.repository.*;
import com.codepilot.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private UserTopicProgressRepository progressRepository;

    @Autowired
    private WrongAnswerRepository wrongAnswerRepository;

    @Autowired
    private UserSkillRepository skillRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private MockInterviewRepository mockInterviewRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserTopicProgressDto> getProgress(Long userId) {
        return progressRepository.findByUserId(userId).stream()
                .map(p -> UserTopicProgressDto.builder()
                        .topicId(p.getTopic().getId())
                        .topicName(p.getTopic().getName())
                        .category(p.getTopic().getCategory())
                        .correctCount(p.getCorrectCount())
                        .totalCount(p.getTotalCount())
                        .accuracyPercentage(p.getAccuracyPercentage())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WrongAnswerResponse getWrongAnswers(Long userId) {
        List<WrongAnswer> wrList = wrongAnswerRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        List<WrongAnswerDto> dtos = wrList.stream()
                .map(w -> WrongAnswerDto.builder()
                        .id(w.getId())
                        .questionId(w.getQuestion().getId())
                        .questionText(w.getQuestion().getQuestionText())
                        .selectedAnswer(w.getSelectedAnswer())
                        .correctAnswer(w.getCorrectAnswer())
                        .explanation(w.getQuestion().getExplanation())
                        .topicName(w.getTopic().getName())
                        .category(w.getTopic().getCategory())
                        .difficulty(w.getDifficulty())
                        .createdAt(w.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Group errors by topic name to show "Most Wrong Topics"
        Map<String, Integer> topicCounts = new HashMap<>();
        for (WrongAnswer w : wrList) {
            topicCounts.put(w.getTopic().getName(), topicCounts.getOrDefault(w.getTopic().getName(), 0) + 1);
        }

        return WrongAnswerResponse.builder()
                .wrongAnswers(dtos)
                .mostWrongTopics(topicCounts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSkillDto> getSkills(Long userId) {
        List<UserSkill> skills = skillRepository.findByUserId(userId);
        
        if (skills.isEmpty()) {
            return topicRepository.findAll().stream()
                    .map(t -> UserSkillDto.builder()
                            .topicId(t.getId())
                            .topicName(t.getName())
                            .category(t.getCategory())
                            .skillLevelPercentage(0.0)
                            .build())
                    .collect(Collectors.toList());
        }

        return skills.stream()
                .map(s -> UserSkillDto.builder()
                        .topicId(s.getTopic().getId())
                        .topicName(s.getTopic().getName())
                        .category(s.getTopic().getCategory())
                        .skillLevelPercentage(s.getSkillLevelPercentage())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReadinessDto getReadiness(Long userId) {
        List<UserTopicProgress> progresses = progressRepository.findByUserId(userId);

        double javaSum = 0;
        int javaCount = 0;
        double sqlSum = 0;
        int sqlCount = 0;
        double dsaSum = 0;
        int dsaCount = 0;

        List<String> strongAreas = new ArrayList<>();
        List<String> weakAreas = new ArrayList<>();
        List<String> recommendedTopics = new ArrayList<>();

        for (UserTopicProgress p : progresses) {
            String cat = p.getTopic().getCategory().toUpperCase();
            double acc = p.getAccuracyPercentage();

            if ("JAVA".equals(cat)) {
                javaSum += acc;
                javaCount++;
            } else if ("SQL".equals(cat)) {
                sqlSum += acc;
                sqlCount++;
            } else if ("DSA".equals(cat)) {
                dsaSum += acc;
                dsaCount++;
            }

            if (acc >= 75.0 && p.getTotalCount() >= 3) {
                strongAreas.add(p.getTopic().getName());
            }
            if (acc < 50.0) {
                weakAreas.add(p.getTopic().getName());
                recommendedTopics.add(p.getTopic().getName());
            }
        }

        double javaScore = javaCount > 0 ? (javaSum / javaCount) : 0.0;
        double sqlScore = sqlCount > 0 ? (sqlSum / sqlCount) : 0.0;
        double dsaScore = dsaCount > 0 ? (dsaSum / dsaCount) : 0.0;

        List<MockInterview> mocks = mockInterviewRepository.findByUserId(userId);
        double mockSum = 0;
        int mockCount = 0;
        for (MockInterview m : mocks) {
            if (m.getEndTime() != null) {
                double pct = (m.getTotalScore() / 20.0) * 100.0;
                mockSum += pct;
                mockCount++;
            }
        }
        double mockInterviewScore = mockCount > 0 ? (mockSum / mockCount) : 0.0;

        LocalDateTime cutoff = LocalDateTime.now().minusDays(14);
        List<QuizAttempt> recentQuizzes = quizAttemptRepository.findByUserId(userId).stream()
                .filter(q -> q.getStartTime().isAfter(cutoff))
                .collect(Collectors.toList());

        List<MockInterview> recentMocks = mockInterviewRepository.findByUserId(userId).stream()
                .filter(m -> m.getStartTime().isAfter(cutoff))
                .collect(Collectors.toList());

        Set<LocalDate> activeDates = new HashSet<>();
        recentQuizzes.forEach(q -> activeDates.add(q.getStartTime().toLocalDate()));
        recentMocks.forEach(m -> activeDates.add(m.getStartTime().toLocalDate()));

        int activeDays = activeDates.size();
        double consistencyScore = Math.min(100.0, (activeDays / 7.0) * 100.0);

        double readiness = (javaScore * 0.25) + (sqlScore * 0.20) + (dsaScore * 0.30) + (mockInterviewScore * 0.20) + (consistencyScore * 0.05);

        if (strongAreas.isEmpty()) {
            strongAreas.add("No strong areas identified yet. Practice more to unlock in strengths!");
        }
        if (weakAreas.isEmpty()) {
            weakAreas.add("Keep practicing to identify topics for improvement!");
        }

        return ReadinessDto.builder()
                .interviewReadiness(Math.round(readiness * 10.0) / 10.0)
                .javaScore(Math.round(javaScore * 10.0) / 10.0)
                .sqlScore(Math.round(sqlScore * 10.0) / 10.0)
                .dsaScore(Math.round(dsaScore * 10.0) / 10.0)
                .mockInterviewScore(Math.round(mockInterviewScore * 10.0) / 10.0)
                .consistencyScore(Math.round(consistencyScore * 10.0) / 10.0)
                .strongAreas(strongAreas)
                .weakAreas(weakAreas)
                .recommendedTopics(recommendedTopics.stream().distinct().limit(3).collect(Collectors.toList()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationDto> getRecommendations(Long userId) {
        return recommendationRepository.findByUserId(userId).stream()
                .map(r -> RecommendationDto.builder()
                        .id(r.getId())
                        .topicId(r.getTopic().getId())
                        .topicName(r.getTopic().getName())
                        .category(r.getTopic().getCategory())
                        .actionMessage(r.getActionMessage())
                        .priority(r.getPriority())
                        .build())
                .collect(Collectors.toList());
    }
}
