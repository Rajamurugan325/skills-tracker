package com.codepilot.dto;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRoleReadinessDto {
    private Long jobRoleId;
    private String jobRoleName;
    private double readinessPercentage;
    private double avgQuizAccuracy;
    private double avgMockAccuracy;
    private Map<String, Double[]> skillComparison; // Topic Name -> [Required Weight, User Weight]
}
