package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterviewSubmitRequest {
    private Long mockInterviewId;
    private Long questionId;
    private String selectedAnswer; // A, B, C, D
}
