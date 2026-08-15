package com.codepilot.service;

import com.codepilot.entity.Question;
import com.codepilot.entity.User;
import java.util.List;

public interface AdaptiveEngineService {
    List<Question> selectQuestions(User user, String category, int count);
}
