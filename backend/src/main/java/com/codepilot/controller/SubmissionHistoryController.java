package com.codepilot.controller;

import com.codepilot.dto.SubmissionHistoryDto;
import com.codepilot.entity.SubmissionHistory;
import com.codepilot.repository.SubmissionHistoryRepository;
import com.codepilot.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionHistoryController {

    @Autowired
    private SubmissionHistoryRepository submissionHistoryRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @GetMapping
    public ResponseEntity<List<SubmissionHistoryDto>> getMySubmissions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SubmissionHistory> histories = submissionHistoryRepository.findByUserIdOrderByCreatedAtDesc(userPrincipal.getId());
        List<SubmissionHistoryDto> dtos = histories.stream()
                .map(h -> SubmissionHistoryDto.builder()
                        .id(h.getId())
                        .questionId(h.getQuestionId())
                        .questionTitle(h.getQuestionTitle())
                        .language(h.getLanguage())
                        .code(h.getCode())
                        .status(h.getStatus())
                        .runtime(h.getRuntime())
                        .memory(h.getMemory())
                        .passedCases(h.getPassedCases())
                        .totalCases(h.getTotalCases())
                        .timestamp(h.getCreatedAt().format(formatter))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
