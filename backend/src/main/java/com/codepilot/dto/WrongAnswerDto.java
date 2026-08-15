package com.codepilot.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WrongAnswerDto {
    private Long id;
    private Long questionId;
    private String questionText;
    private String selectedAnswer;
    private String correctAnswer;
    private String explanation;
    private String topicName;
    private String category;
    private String difficulty;
    private LocalDateTime createdAt;
}
