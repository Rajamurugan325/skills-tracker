package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkillDto {
    private Long topicId;
    private String topicName;
    private String category;
    private double skillLevelPercentage;
}
