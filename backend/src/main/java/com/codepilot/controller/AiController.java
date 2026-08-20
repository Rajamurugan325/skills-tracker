package com.codepilot.controller;

import com.codepilot.dto.ChatMessageDto;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(aiService.getChatHistory(userPrincipal.getId()));
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatMessageDto> chat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(aiService.chat(userPrincipal.getId(), message));
    }
}
