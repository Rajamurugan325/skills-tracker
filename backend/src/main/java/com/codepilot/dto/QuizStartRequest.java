package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizStartRequest {
    private String category; // JAVA, SQL, DSA
    private Long topicId;    // Optional, if they want to practice a specific topic
}
