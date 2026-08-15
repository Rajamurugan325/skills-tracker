package com.codepilot.service.impl;

import com.codepilot.dto.QuestionDto;
import com.codepilot.entity.Question;
import com.codepilot.entity.Topic;
import com.codepilot.exception.ResourceNotFoundException;
import com.codepilot.repository.QuestionRepository;
import com.codepilot.repository.TopicRepository;
import com.codepilot.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Override
    @Transactional
    public QuestionDto createQuestion(QuestionDto questionDto) {
        Topic topic = topicRepository.findById(questionDto.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + questionDto.getTopicId()));

        Question question = mapToEntity(questionDto, topic);
        Question savedQuestion = questionRepository.save(question);
        return mapToDto(savedQuestion);
    }

    @Override
    @Transactional
    public QuestionDto updateQuestion(Long id, QuestionDto questionDto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        Topic topic = topicRepository.findById(questionDto.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + questionDto.getTopicId()));

        question.setTopic(topic);
        question.setQuestionText(questionDto.getQuestionText());
        question.setOptionA(questionDto.getOptionA());
        question.setOptionB(questionDto.getOptionB());
        question.setOptionC(questionDto.getOptionC());
        question.setOptionD(questionDto.getOptionD());
        question.setCorrectAnswer(questionDto.getCorrectAnswer().toUpperCase());
        question.setExplanation(questionDto.getExplanation());
        question.setDifficulty(questionDto.getDifficulty().toUpperCase());

        Question updatedQuestion = questionRepository.save(question);
        return mapToDto(updatedQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question not found with id: " + id);
        }
        questionRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionDto> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionDto getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return mapToDto(question);
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionDto getRandomQuestion() {
        List<Question> questions = questionRepository.findAll();
        if (questions.isEmpty()) {
            throw new ResourceNotFoundException("No questions found in the database");
        }
        int randomIndex = (int) (Math.random() * questions.size());
        return mapToDto(questions.get(randomIndex));
    }

    private QuestionDto mapToDto(Question question) {
        return QuestionDto.builder()
                .id(question.getId())
                .topicId(question.getTopic().getId())
                .topicName(question.getTopic().getName())
                .category(question.getTopic().getCategory())
                .questionText(question.getQuestionText())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(question.getCorrectAnswer())
                .explanation(question.getExplanation())
                .difficulty(question.getDifficulty())
                .build();
    }

    private Question mapToEntity(QuestionDto dto, Topic topic) {
        return Question.builder()
                .id(dto.getId())
                .topic(topic)
                .questionText(dto.getQuestionText())
                .optionA(dto.getOptionA())
                .optionB(dto.getOptionB())
                .optionC(dto.getOptionC())
                .optionD(dto.getOptionD())
                .correctAnswer(dto.getCorrectAnswer().toUpperCase())
                .explanation(dto.getExplanation())
                .difficulty(dto.getDifficulty().toUpperCase())
                .build();
    }
}
