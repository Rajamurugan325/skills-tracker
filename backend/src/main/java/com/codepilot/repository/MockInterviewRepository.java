package com.codepilot.repository;

import com.codepilot.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    List<MockInterview> findByUserIdOrderByStartTimeDesc(Long userId);
    List<MockInterview> findByUserId(Long userId);
}
