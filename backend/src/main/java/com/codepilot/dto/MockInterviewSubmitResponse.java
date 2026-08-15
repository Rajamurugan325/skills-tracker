package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterviewSubmitResponse {
    private Long mockInterviewId;
    private int currentRound;
    private int questionIndex; // 1 to 20
    private QuizQuestionDto nextQuestion;
    private boolean isFinished;
    private MockInterviewScorecardDto scorecard;
}
