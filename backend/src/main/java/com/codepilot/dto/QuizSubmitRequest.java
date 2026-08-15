package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmitRequest {
    private Long attemptId;
    private List<QuizAnswerSubmitDto> answers;
}
