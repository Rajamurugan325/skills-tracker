package com.codepilot.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultDto {
    private Long attemptId;
    private Long userId;
    private int score;
    private int totalQuestions;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<QuizAnswerDetailDto> answers;
}
