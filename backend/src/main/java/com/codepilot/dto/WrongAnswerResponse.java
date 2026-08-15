package com.codepilot.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WrongAnswerResponse {
    private List<WrongAnswerDto> wrongAnswers;
    private Map<String, Integer> mostWrongTopics; // Topic Name -> Error Count
}
