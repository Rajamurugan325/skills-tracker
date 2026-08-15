package com.codepilot.service;

import com.codepilot.dto.*;
import java.util.List;

public interface AnalyticsService {
    List<UserTopicProgressDto> getProgress(Long userId);
    WrongAnswerResponse getWrongAnswers(Long userId);
    List<UserSkillDto> getSkills(Long userId);
    ReadinessDto getReadiness(Long userId);
    List<RecommendationDto> getRecommendations(Long userId);
}
