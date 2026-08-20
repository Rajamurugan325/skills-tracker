package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestionDto {
    private Long id;
    private Long topicId;
    private String topicName;
    private String category;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String difficulty;
    private String questionType;
}
