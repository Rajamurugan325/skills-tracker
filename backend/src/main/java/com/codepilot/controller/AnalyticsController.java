package com.codepilot.controller;

import com.codepilot.dto.*;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/progress")
    public ResponseEntity<List<UserTopicProgressDto>> getProgress(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(analyticsService.getProgress(userPrincipal.getId()));
    }

    @GetMapping("/wrong-answers")
    public ResponseEntity<WrongAnswerResponse> getWrongAnswers(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(analyticsService.getWrongAnswers(userPrincipal.getId()));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<UserSkillDto>> getSkills(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(analyticsService.getSkills(userPrincipal.getId()));
    }

    @GetMapping("/readiness")
    public ResponseEntity<ReadinessDto> getReadiness(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(analyticsService.getReadiness(userPrincipal.getId()));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationDto>> getRecommendations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(analyticsService.getRecommendations(userPrincipal.getId()));
    }
}
