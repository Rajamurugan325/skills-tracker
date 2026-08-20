package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiActionResponse {
    private String explanation;
    private String correctedCode;
    private String originalComplexity;
    private String improvedComplexity;
    private String generatedCode;
    private List<String> reviewItems; // e.g. ["🔴 Critical: Hardcoded key found", "🟠 Warning: Simplify names"]
}
