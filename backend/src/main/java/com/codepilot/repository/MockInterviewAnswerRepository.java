package com.codepilot.repository;

import com.codepilot.entity.MockInterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MockInterviewAnswerRepository extends JpaRepository<MockInterviewAnswer, Long> {
}
