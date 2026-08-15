package com.codepilot.service.impl;

import com.codepilot.entity.*;
import com.codepilot.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageRequest;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class AdaptiveEngineServiceTest {

    @InjectMocks
    private AdaptiveEngineServiceImpl adaptiveEngineService;

    @Mock
    private QuizAnswerRepository quizAnswerRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testDetermineTargetDifficulty_Escalation() {
        Long userId = 1L;
        Long topicId = 1L;

        Question easyQ = Question.builder().difficulty("EASY").build();
        QuizAnswer ans1 = QuizAnswer.builder().question(easyQ).isCorrect(true).build();
        QuizAnswer ans2 = QuizAnswer.builder().question(easyQ).isCorrect(true).build();
        QuizAnswer ans3 = QuizAnswer.builder().question(easyQ).isCorrect(true).build();

        List<QuizAnswer> mockAnswers = Arrays.asList(ans1, ans2, ans3);
        when(quizAnswerRepository.findLastAnswersByTopic(userId, topicId, PageRequest.of(0, 3)))
                .thenReturn(mockAnswers);

        // 3 correct answers, should shift difficulty from EASY to MEDIUM
        String nextDifficulty = adaptiveEngineService.determineTargetDifficulty(userId, topicId);
        assertEquals("MEDIUM", nextDifficulty);
    }

    @Test
    public void testDetermineTargetDifficulty_Deescalation() {
        Long userId = 1L;
        Long topicId = 1L;

        Question hardQ = Question.builder().difficulty("HARD").build();
        QuizAnswer ans1 = QuizAnswer.builder().question(hardQ).isCorrect(false).build();
        QuizAnswer ans2 = QuizAnswer.builder().question(hardQ).isCorrect(false).build();

        List<QuizAnswer> mockAnswers = Arrays.asList(ans1, ans2);
        when(quizAnswerRepository.findLastAnswersByTopic(userId, topicId, PageRequest.of(0, 3)))
                .thenReturn(mockAnswers);

        // 2 wrong answers, should shift difficulty from HARD to MEDIUM
        String nextDifficulty = adaptiveEngineService.determineTargetDifficulty(userId, topicId);
        assertEquals("MEDIUM", nextDifficulty);
    }

    @Test
    public void testDetermineTargetDifficulty_Maintain() {
        Long userId = 1L;
        Long topicId = 1L;

        Question mediumQ = Question.builder().difficulty("MEDIUM").build();
        QuizAnswer ans1 = QuizAnswer.builder().question(mediumQ).isCorrect(true).build();
        QuizAnswer ans2 = QuizAnswer.builder().question(mediumQ).isCorrect(false).build();

        List<QuizAnswer> mockAnswers = Arrays.asList(ans1, ans2);
        when(quizAnswerRepository.findLastAnswersByTopic(userId, topicId, PageRequest.of(0, 3)))
                .thenReturn(mockAnswers);

        String nextDifficulty = adaptiveEngineService.determineTargetDifficulty(userId, topicId);
        assertEquals("MEDIUM", nextDifficulty);
    }

    @Test
    public void testDetermineTargetDifficulty_DefaultIfEmpty() {
        Long userId = 1L;
        Long topicId = 1L;

        when(quizAnswerRepository.findLastAnswersByTopic(userId, topicId, PageRequest.of(0, 3)))
                .thenReturn(Collections.emptyList());

        String nextDifficulty = adaptiveEngineService.determineTargetDifficulty(userId, topicId);
        assertEquals("EASY", nextDifficulty);
    }
}
