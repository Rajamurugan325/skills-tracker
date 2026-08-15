package com.codepilot.controller;

import com.codepilot.dto.QuizAttemptDto;
import com.codepilot.dto.QuizResultDto;
import com.codepilot.dto.QuizStartRequest;
import com.codepilot.dto.QuizSubmitRequest;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/quiz/start")
    public ResponseEntity<QuizAttemptDto> startQuiz(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                     @RequestBody QuizStartRequest startRequest) {
        QuizAttemptDto attempt = quizService.startQuiz(userPrincipal.getId(), startRequest);
        return ResponseEntity.ok(attempt);
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizResultDto> submitQuiz(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                     @RequestBody QuizSubmitRequest submitRequest) {
        QuizResultDto result = quizService.submitQuiz(userPrincipal.getId(), submitRequest);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/results")
    public ResponseEntity<List<QuizResultDto>> getQuizHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<QuizResultDto> history = quizService.getHistory(userPrincipal.getId());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<QuizResultDto> getAttemptResult(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                           @PathVariable Long id) {
        QuizResultDto result = quizService.getAttemptResult(userPrincipal.getId(), id);
        return ResponseEntity.ok(result);
    }
}
