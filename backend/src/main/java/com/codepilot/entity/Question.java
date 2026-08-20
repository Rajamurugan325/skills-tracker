package com.codepilot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "option_a", nullable = false, columnDefinition = "TEXT")
    private String optionA;

    @Column(name = "option_b", nullable = false, columnDefinition = "TEXT")
    private String optionB;

    @Column(name = "option_c", nullable = false, columnDefinition = "TEXT")
    private String optionC;

    @Column(name = "option_d", nullable = false, columnDefinition = "TEXT")
    private String optionD;

    @Column(name = "correct_answer", nullable = false, length = 1)
    private String correctAnswer; // A, B, C, D

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false, length = 20)
    private String difficulty; // EASY, MEDIUM, HARD

    @Column(name = "question_type", length = 30)
    private String questionType;

    public String getQuestionType() {
        if (questionType != null && !questionType.isEmpty()) {
            return questionType;
        }
        if (topic != null) {
            String cat = topic.getCategory();
            if ("SQL".equalsIgnoreCase(cat)) return "SQL";
            if ("FULLSTACK".equalsIgnoreCase(cat)) return "WEB";
            if ("APTITUDE".equalsIgnoreCase(cat)) return "APTITUDE";
            if ("HR".equalsIgnoreCase(cat) || "BEHAVIORAL".equalsIgnoreCase(cat)) return "HR";
        }
        return "MCQ";
    }

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
