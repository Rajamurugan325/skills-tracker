package com.codepilot.controller;

import com.codepilot.dto.QuestionDto;
import com.codepilot.dto.QuizAnswerSubmitDto;
import com.codepilot.entity.*;
import com.codepilot.repository.*;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private WrongAnswerRepository wrongAnswerRepository;

    @Autowired
    private UserTopicProgressRepository userTopicProgressRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @GetMapping
    public ResponseEntity<List<QuestionDto>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/random")
    public ResponseEntity<QuestionDto> getRandomQuestion() {
        return ResponseEntity.ok(questionService.getRandomQuestion());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<Void> submitPracticeAnswer(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                     @RequestBody QuizAnswerSubmitDto submitDto) {
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        Question question = questionRepository.findById(submitDto.getQuestionId()).orElse(null);

        if (user == null || question == null) {
            return ResponseEntity.badRequest().build();
        }

        String selected = submitDto.getSelectedAnswer().toUpperCase().trim();
        boolean isCorrect = selected.equals(question.getCorrectAnswer().toUpperCase().trim());

        // Update progress
        UserTopicProgress progress = userTopicProgressRepository.findByUserIdAndTopicId(user.getId(), question.getTopic().getId())
                .orElseGet(() -> UserTopicProgress.builder()
                        .user(user)
                        .topic(question.getTopic())
                        .correctCount(0)
                        .totalCount(0)
                        .build());

        progress.setTotalCount(progress.getTotalCount() + 1);
        if (isCorrect) {
            progress.setCorrectCount(progress.getCorrectCount() + 1);
        }
        UserTopicProgress savedProgress = userTopicProgressRepository.save(progress);

        // Sync Skill
        UserSkill skill = userSkillRepository.findByUserIdAndTopicId(user.getId(), question.getTopic().getId())
                .orElseGet(() -> UserSkill.builder()
                        .user(user)
                        .topic(question.getTopic())
                        .build());
        skill.setSkillLevelPercentage(savedProgress.getAccuracyPercentage());
        userSkillRepository.save(skill);

        // Save Wrong Answer if incorrect
        if (!isCorrect) {
            WrongAnswer wrong = WrongAnswer.builder()
                    .user(user)
                    .question(question)
                    .selectedAnswer(selected)
                    .correctAnswer(question.getCorrectAnswer())
                    .topic(question.getTopic())
                    .difficulty(question.getDifficulty())
                    .build();
            wrongAnswerRepository.save(wrong);
        }

        // Handle recommendations
        if (savedProgress.getAccuracyPercentage() < 50.0 && savedProgress.getTotalCount() >= 3) {
            boolean alreadyExists = recommendationRepository.findByUserId(user.getId()).stream()
                    .anyMatch(r -> r.getTopic().getId().equals(question.getTopic().getId()));
            if (!alreadyExists) {
                Recommendation rec = Recommendation.builder()
                        .user(user)
                        .topic(question.getTopic())
                        .actionMessage("Practice " + question.getTopic().getName() + " - Focus on Easy/Medium concepts to build foundation.")
                        .priority("HIGH")
                        .build();
                recommendationRepository.save(rec);
            }
        } else if (savedProgress.getAccuracyPercentage() >= 70.0) {
            List<Recommendation> recs = recommendationRepository.findByUserId(user.getId());
            for (Recommendation r : recs) {
                if (r.getTopic().getId().equals(question.getTopic().getId())) {
                    recommendationRepository.delete(r);
                }
            }
        }

        return ResponseEntity.ok().build();
    }
}
