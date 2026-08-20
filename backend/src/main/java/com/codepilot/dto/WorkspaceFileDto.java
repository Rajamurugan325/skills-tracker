package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceFileDto {
    private String name;
    private String path;
    private String type; // FILE or DIRECTORY
    private String content; // null for directories, unless requested
    private long size;
}
