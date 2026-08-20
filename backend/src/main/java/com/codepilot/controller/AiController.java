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

    @PostMapping(value = "/chat", consumes = {"application/json"})
    public ResponseEntity<ChatMessageDto> chatJson(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(aiService.chat(userPrincipal.getId(), message, null, null, null));
    }

    @PostMapping(value = "/chat", consumes = {"multipart/form-data"})
    public ResponseEntity<ChatMessageDto> chatMultipart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("message") String message,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String fileUrl = null;
        String fileType = null;
        String fileName = null;

        if (file != null && !file.isEmpty()) {
            try {
                java.io.File uploadDir = new java.io.File("uploads");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                String originalFilename = file.getOriginalFilename();
                String ext = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    ext = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String newFilename = java.util.UUID.randomUUID().toString() + ext;
                java.io.File destFile = new java.io.File(uploadDir, newFilename);
                file.transferTo(destFile);

                fileUrl = "/uploads/" + newFilename;
                fileName = originalFilename;
                fileType = file.getContentType();
            } catch (Exception e) {
                System.err.println("File upload error: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(aiService.chat(userPrincipal.getId(), message, fileUrl, fileType, fileName));
    }
}
