package com.codepilot.service;

import com.codepilot.dto.QuestionDto;
import java.util.List;

public interface QuestionService {
    QuestionDto createQuestion(QuestionDto questionDto);
    QuestionDto updateQuestion(Long id, QuestionDto questionDto);
    void deleteQuestion(Long id);
    List<QuestionDto> getAllQuestions();
    QuestionDto getQuestionById(Long id);
    QuestionDto getRandomQuestion();
}
