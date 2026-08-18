package com.codepilot.controller;

import com.codepilot.dto.*;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mock-interview")
public class MockInterviewController {

    @Autowired
    private MockInterviewService mockInterviewService;

    @PostMapping("/start")
    public ResponseEntity<MockInterviewStartResponse> startInterview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) MockInterviewStartRequest request) {
        MockInterviewStartResponse start = mockInterviewService.startInterview(userPrincipal.getId(), request);
        return ResponseEntity.ok(start);
    }

    @PostMapping("/submit")
    public ResponseEntity<MockInterviewSubmitResponse> submitAnswer(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                     @RequestBody MockInterviewSubmitRequest request) {
        MockInterviewSubmitResponse response = mockInterviewService.submitAnswer(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<MockInterviewScorecardDto> getScorecard(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                   @PathVariable Long id) {
        MockInterviewScorecardDto scorecard = mockInterviewService.getScorecard(userPrincipal.getId(), id);
        return ResponseEntity.ok(scorecard);
    }
}
