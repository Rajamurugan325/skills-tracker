package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTopicProgressDto {
    private Long topicId;
    private String topicName;
    private String category;
    private int correctCount;
    private int totalCount;
    private double accuracyPercentage;
}
