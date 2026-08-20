package com.codepilot.service;

import com.codepilot.dto.ChatMessageDto;
import java.util.List;

public interface AiService {
    List<ChatMessageDto> getChatHistory(Long userId);
    ChatMessageDto chat(Long userId, String userMessage);
}
