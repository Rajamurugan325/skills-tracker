package com.codepilot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submission_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "question_title", nullable = false)
    private String questionTitle;

    @Column(nullable = false, length = 30)
    private String language;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false, length = 50)
    private String status; // Accepted, Wrong Answer, etc.

    private String runtime;
    private String memory;

    @Column(name = "passed_cases")
    private int passedCases;

    @Column(name = "total_cases")
    private int totalCases;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
