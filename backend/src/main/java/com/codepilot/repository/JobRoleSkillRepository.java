package com.codepilot.repository;

import com.codepilot.entity.JobRoleSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRoleSkillRepository extends JpaRepository<JobRoleSkill, Long> {
    List<JobRoleSkill> findByJobRoleId(Long jobRoleId);
}
