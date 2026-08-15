package com.codepilot.repository;

import com.codepilot.entity.QuizAnswer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {

    @Query("SELECT qa.question.id FROM QuizAnswer qa WHERE qa.quizAttempt.user.id = :userId ORDER BY qa.quizAttempt.startTime DESC")
    List<Long> findRecentQuestionIds(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT qa FROM QuizAnswer qa WHERE qa.quizAttempt.user.id = :userId AND qa.question.topic.id = :topicId ORDER BY qa.quizAttempt.startTime DESC")
    List<QuizAnswer> findLastAnswersByTopic(@Param("userId") Long userId, @Param("topicId") Long topicId, Pageable pageable);
}
