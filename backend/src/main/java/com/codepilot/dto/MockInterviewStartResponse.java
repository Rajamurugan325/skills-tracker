package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterviewStartResponse {
    private Long mockInterviewId;
    private int totalQuestions; // 20
    private QuizQuestionDto firstQuestion;
    private int currentRound;   // 1
    private String roundName;
    private int questionIndex;  // 1
}
