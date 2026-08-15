package com.codepilot.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptDto {
    private Long attemptId;
    private Long userId;
    private LocalDateTime startTime;
    private int totalQuestions;
    private List<QuizQuestionDto> questions;
}
