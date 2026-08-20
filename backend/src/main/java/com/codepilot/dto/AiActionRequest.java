package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiActionRequest {
    private String action; // GENERATE, EXPLAIN, BUG_DETECT, REFACTOR, TEST_GEN, OPTIMIZE, SECURE, DOCUMENT, CONVERT, REVIEW, SQL_ASSIST, API_GEN, LEARNING, GIT, DEVOPS, DEPENDENCY
    private String code;
    private String language;
    private String extraPrompt;
    private String fileName;
    private String targetLanguage; // used for CONVERT
}
