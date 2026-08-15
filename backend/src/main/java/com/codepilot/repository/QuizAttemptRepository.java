package com.codepilot.repository;

import com.codepilot.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdOrderByStartTimeDesc(Long userId);
    List<QuizAttempt> findByUserId(Long userId);
}
