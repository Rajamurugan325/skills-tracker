package com.codepilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {

    private Long id;

    @NotNull
    private Long topicId;

    private String topicName;
    private String category;

    @NotBlank
    private String questionText;

    @NotBlank
    private String optionA;

    @NotBlank
    private String optionB;

    @NotBlank
    private String optionC;

    @NotBlank
    private String optionD;

    @NotBlank
    @Size(min = 1, max = 1)
    private String correctAnswer; // A, B, C, or D

    private String explanation;

    @NotBlank
    private String difficulty; // EASY, MEDIUM, HARD
}
