package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDto {
    private Long id;
    private Long topicId;
    private String topicName;
    private String category;
    private String actionMessage;
    private String priority; // HIGH, MEDIUM, LOW
}
