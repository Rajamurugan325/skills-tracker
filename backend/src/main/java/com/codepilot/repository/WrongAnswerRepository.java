package com.codepilot.repository;

import com.codepilot.entity.WrongAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WrongAnswerRepository extends JpaRepository<WrongAnswer, Long> {
    List<WrongAnswer> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<WrongAnswer> findByUserId(Long userId);

    @Query("SELECT w.topic.id, COUNT(w) FROM WrongAnswer w WHERE w.user.id = :userId GROUP BY w.topic.id")
    List<Object[]> countWrongAnswersByTopicId(@Param("userId") Long userId);
}
