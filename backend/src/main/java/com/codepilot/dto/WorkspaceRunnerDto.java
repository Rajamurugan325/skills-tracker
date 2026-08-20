package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceRunnerDto {
    private String stdout;
    private String stderr;
    private int exitCode;
}
