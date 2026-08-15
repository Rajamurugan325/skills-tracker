package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterviewScorecardDto {
    private Long mockInterviewId;
    private int totalScore; // out of 20
    private int javaScore;  // out of 5
    private int sqlScore;   // out of 5
    private int dsaScore;   // out of 5
    private int techScore;  // out of 5
    private String feedbackSummary;
    private List<String> strongAreas;
    private List<String> weakAreas;
    private List<String> recommendations;
}
