package com.codepilot.service;

import com.codepilot.dto.*;
import java.util.List;

public interface MockInterviewService {
    MockInterviewStartResponse startInterview(Long userId, MockInterviewStartRequest request);
    MockInterviewSubmitResponse submitAnswer(Long userId, MockInterviewSubmitRequest request);
    MockInterviewScorecardDto getScorecard(Long userId, Long interviewId);
    List<JobRoleDto> getAllJobRoles();
    JobRoleReadinessDto getJobReadiness(Long userId, Long jobRoleId);
    void selectJobRole(Long userId, Long jobRoleId);
}
