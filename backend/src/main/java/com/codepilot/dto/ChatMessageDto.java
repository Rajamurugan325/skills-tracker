package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {
    private String message;
    private String sender; // USER or AI
    private String timestamp;
    private String fileUrl;
    private String fileType;
    private String fileName;
}
