package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionHistoryDto {
    private Long id;
    private Long questionId;
    private String questionTitle;
    private String language;
    private String code;
    private String status;
    private String runtime;
    private String memory;
    private int passedCases;
    private int totalCases;
    private String timestamp;
}
