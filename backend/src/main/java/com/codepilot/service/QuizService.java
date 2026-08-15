package com.codepilot.service;

import com.codepilot.dto.QuizAttemptDto;
import com.codepilot.dto.QuizResultDto;
import com.codepilot.dto.QuizStartRequest;
import com.codepilot.dto.QuizSubmitRequest;
import java.util.List;

public interface QuizService {
    QuizAttemptDto startQuiz(Long userId, QuizStartRequest startRequest);
    QuizResultDto submitQuiz(Long userId, QuizSubmitRequest submitRequest);
    List<QuizResultDto> getHistory(Long userId);
    QuizResultDto getAttemptResult(Long userId, Long attemptId);
}
