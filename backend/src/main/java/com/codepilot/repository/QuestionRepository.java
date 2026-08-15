package com.codepilot.repository;

import com.codepilot.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicId(Long topicId);
    List<Question> findByTopicIdAndDifficulty(Long topicId, String difficulty);
    long countByTopicId(Long topicId);
}
