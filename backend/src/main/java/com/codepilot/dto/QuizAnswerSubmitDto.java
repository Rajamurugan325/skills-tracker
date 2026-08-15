package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAnswerSubmitDto {
    private Long questionId;
    private String selectedAnswer; // A, B, C, D
}
