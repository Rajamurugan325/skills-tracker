package com.codepilot.repository;

import com.codepilot.entity.SubmissionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionHistoryRepository extends JpaRepository<SubmissionHistory, Long> {
    List<SubmissionHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SubmissionHistory> findByUserIdAndQuestionIdOrderByCreatedAtDesc(Long userId, Long questionId);
}
