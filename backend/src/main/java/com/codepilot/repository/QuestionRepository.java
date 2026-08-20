package com.codepilot.repository;

import com.codepilot.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicId(Long topicId);
    List<Question> findByTopicIdAndDifficulty(Long topicId, String difficulty);
    long countByTopicId(Long topicId);

    @Query(value = "SELECT q.* FROM questions q " +
                   "JOIN topics t ON q.topic_id = t.id " +
                   "WHERE UPPER(t.category) = UPPER(:category) " +
                   "ORDER BY RAND() LIMIT :limitCount", nativeQuery = true)
    List<Question> findRandomByCategory(@Param("category") String category, @Param("limitCount") int limitCount);

    @Query(value = "SELECT q.* FROM questions q " +
                   "WHERE q.id NOT IN :excludedIds " +
                   "ORDER BY RAND() LIMIT :limitCount", nativeQuery = true)
    List<Question> findRandomExcluding(@Param("excludedIds") Collection<Long> excludedIds, @Param("limitCount") int limitCount);

    @Query(value = "SELECT q.* FROM questions q " +
                   "WHERE q.topic_id = :topicId " +
                   "ORDER BY RAND() LIMIT :limitCount", nativeQuery = true)
    List<Question> findRandomByTopicId(@Param("topicId") Long topicId, @Param("limitCount") int limitCount);

    @Query(value = "SELECT q.* FROM questions q " +
                   "ORDER BY RAND() LIMIT :limitCount", nativeQuery = true)
    List<Question> findRandom(@Param("limitCount") int limitCount);

    @Query(value = "SELECT q.* FROM questions q " +
                   "WHERE q.topic_id = :topicId AND q.difficulty = :difficulty " +
                   "AND q.id NOT IN :excludedIds " +
                   "ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Question> findRandomByTopicIdAndDifficultyExcluding(
            @Param("topicId") Long topicId, 
            @Param("difficulty") String difficulty, 
            @Param("excludedIds") Collection<Long> excludedIds);

    @Query(value = "SELECT q.* FROM questions q " +
                   "WHERE q.topic_id = :topicId " +
                   "AND q.id NOT IN :excludedIds " +
                   "ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Question> findRandomByTopicIdExcluding(
            @Param("topicId") Long topicId, 
            @Param("excludedIds") Collection<Long> excludedIds);

    @Query(value = "SELECT q.* FROM questions q " +
                   "JOIN topics t ON q.topic_id = t.id " +
                   "WHERE (:category IS NULL OR UPPER(t.category) = UPPER(:category)) " +
                   "AND q.id NOT IN :excludedIds " +
                   "ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Question> findRandomByCategoryExcluding(
            @Param("category") String category, 
            @Param("excludedIds") Collection<Long> excludedIds);

    @Query(value = "SELECT q.* FROM questions q " +
                   "JOIN topics t ON q.topic_id = t.id " +
                   "WHERE UPPER(q.question_text) LIKE UPPER(CONCAT('%', :query, '%')) " +
                   "OR UPPER(t.name) LIKE UPPER(CONCAT('%', :query, '%')) " +
                   "LIMIT 5", nativeQuery = true)
    List<Question> searchByKeyword(@Param("query") String query);
}
