package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadinessDto {
    private double interviewReadiness; // e.g. 68%
    private double javaScore;
    private double sqlScore;
    private double dsaScore;
    private double mockInterviewScore;
    private double consistencyScore;
    private List<String> strongAreas;
    private List<String> weakAreas;
    private List<String> recommendedTopics;
}
