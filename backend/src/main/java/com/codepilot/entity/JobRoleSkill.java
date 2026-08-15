package com.codepilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_role_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"job_role_id", "topic_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRoleSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "required_weight")
    private double requiredWeight; // Target skill level (e.g. 70.0 for 70%)
}
