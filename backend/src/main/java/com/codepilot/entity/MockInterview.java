package com.codepilot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mock_interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockInterview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "total_score")
    private int totalScore;

    @Column(name = "java_score")
    private int javaScore;

    @Column(name = "sql_score")
    private int sqlScore;

    @Column(name = "dsa_score")
    private int dsaScore;

    @Column(name = "tech_score")
    private int techScore;

    @Column(name = "overall_readiness")
    private double overallReadiness;

    @Column(name = "feedback_summary", columnDefinition = "TEXT")
    private String feedbackSummary;

    @OneToMany(mappedBy = "mockInterview", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MockInterviewAnswer> answers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        startTime = LocalDateTime.now();
    }
}
