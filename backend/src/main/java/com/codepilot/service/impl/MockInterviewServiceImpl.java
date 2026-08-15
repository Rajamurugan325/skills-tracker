package com.codepilot.service.impl;

import com.codepilot.dto.*;
import com.codepilot.entity.*;
import com.codepilot.exception.BadRequestException;
import com.codepilot.exception.ResourceNotFoundException;
import com.codepilot.repository.*;
import com.codepilot.service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MockInterviewServiceImpl implements MockInterviewService {

    @Autowired
    private MockInterviewRepository mockInterviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private MockInterviewAnswerRepository mockInterviewAnswerRepository;

    @Autowired
    private JobRoleRepository jobRoleRepository;

    @Autowired
    private JobRoleSkillRepository jobRoleSkillRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Override
    @Transactional
    public MockInterviewStartResponse startInterview(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Select Questions for each round
        // Round 1: Java (5 Questions)
        List<Question> javaQuestions = questionRepository.findAll().stream()
                .filter(q -> "JAVA".equalsIgnoreCase(q.getTopic().getCategory()))
                .collect(Collectors.toList());
        Collections.shuffle(javaQuestions);
        List<Question> round1 = javaQuestions.stream().limit(5).collect(Collectors.toList());

        // Round 2: SQL (5 Questions)
        List<Question> sqlQuestions = questionRepository.findAll().stream()
                .filter(q -> "SQL".equalsIgnoreCase(q.getTopic().getCategory()))
                .collect(Collectors.toList());
        Collections.shuffle(sqlQuestions);
        List<Question> round2 = sqlQuestions.stream().limit(5).collect(Collectors.toList());

        // Round 3: DSA (5 Questions)
        List<Question> dsaQuestions = questionRepository.findAll().stream()
                .filter(q -> "DSA".equalsIgnoreCase(q.getTopic().getCategory()))
                .collect(Collectors.toList());
        Collections.shuffle(dsaQuestions);
        List<Question> round3 = dsaQuestions.stream().limit(5).collect(Collectors.toList());

        // Round 4: Tech Interview (5 mixed questions)
        List<Question> allQuestions = questionRepository.findAll();
        Collections.shuffle(allQuestions);
        List<Question> round4 = allQuestions.stream()
                .filter(q -> !round1.contains(q) && !round2.contains(q) && !round3.contains(q))
                .limit(5)
                .collect(Collectors.toList());

        List<Question> selectedQuestions = new ArrayList<>();
        selectedQuestions.addAll(round1);
        selectedQuestions.addAll(round2);
        selectedQuestions.addAll(round3);
        selectedQuestions.addAll(round4);

        if (selectedQuestions.size() < 20) {
            throw new BadRequestException("Not enough questions in database to assemble a 20-question mock interview.");
        }

        // Initialize Mock Interview
        MockInterview interview = MockInterview.builder()
                .user(user)
                .build();
        MockInterview savedInterview = mockInterviewRepository.save(interview);

        // Save Answers sequentially
        for (Question q : selectedQuestions) {
            MockInterviewAnswer mia = MockInterviewAnswer.builder()
                    .mockInterview(savedInterview)
                    .question(q)
                    .selectedAnswer("")
                    .isCorrect(false)
                    .build();
            mockInterviewAnswerRepository.save(mia);
        }

        // Fetch first question details
        Question firstQ = selectedQuestions.get(0);
        QuizQuestionDto firstQDto = QuizQuestionDto.builder()
                .id(firstQ.getId())
                .topicId(firstQ.getTopic().getId())
                .topicName(firstQ.getTopic().getName())
                .category(firstQ.getTopic().getCategory())
                .questionText(firstQ.getQuestionText())
                .optionA(firstQ.getOptionA())
                .optionB(firstQ.getOptionB())
                .optionC(firstQ.getOptionC())
                .optionD(firstQ.getOptionD())
                .difficulty(firstQ.getDifficulty())
                .build();

        return MockInterviewStartResponse.builder()
                .mockInterviewId(savedInterview.getId())
                .totalQuestions(20)
                .firstQuestion(firstQDto)
                .currentRound(1)
                .questionIndex(1)
                .build();
    }

    @Override
    @Transactional
    public MockInterviewSubmitResponse submitAnswer(Long userId, MockInterviewSubmitRequest request) {
        MockInterview interview = mockInterviewRepository.findById(request.getMockInterviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Mock Interview not found with id: " + request.getMockInterviewId()));

        if (!interview.getUser().getId().equals(userId)) {
            throw new BadRequestException("This mock interview does not belong to the logged-in user.");
        }

        if (interview.getEndTime() != null) {
            throw new BadRequestException("This mock interview has already been completed.");
        }

        // Load all answers ordered by ID
        List<MockInterviewAnswer> answers = mockInterviewAnswerRepository.findAll().stream()
                .filter(a -> a.getMockInterview().getId().equals(interview.getId()))
                .sorted(Comparator.comparing(MockInterviewAnswer::getId))
                .collect(Collectors.toList());

        // Update the current question response
        MockInterviewAnswer currentAnswer = answers.stream()
                .filter(a -> a.getQuestion().getId().equals(request.getQuestionId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Question not mapped in this mock interview."));

        String selected = request.getSelectedAnswer().toUpperCase().trim();
        currentAnswer.setSelectedAnswer(selected);
        currentAnswer.setCorrect(selected.equals(currentAnswer.getQuestion().getCorrectAnswer().toUpperCase().trim()));
        mockInterviewAnswerRepository.save(currentAnswer);

        // Find next unanswered question
        MockInterviewAnswer nextAnswer = null;
        int nextIndex = 1;
        for (int i = 0; i < answers.size(); i++) {
            if (answers.get(i).getSelectedAnswer().isEmpty()) {
                nextAnswer = answers.get(i);
                nextIndex = i + 1;
                break;
            }
        }

        if (nextAnswer != null) {
            // Determine current round
            // 1-5 -> Round 1 (Java)
            // 6-10 -> Round 2 (SQL)
            // 11-15 -> Round 3 (DSA)
            // 16-20 -> Round 4 (Tech Interview)
            int round = 1;
            if (nextIndex > 15) {
                round = 4;
            } else if (nextIndex > 10) {
                round = 3;
            } else if (nextIndex > 5) {
                round = 2;
            }

            Question nq = nextAnswer.getQuestion();
            QuizQuestionDto nextQDto = QuizQuestionDto.builder()
                    .id(nq.getId())
                    .topicId(nq.getTopic().getId())
                    .topicName(nq.getTopic().getName())
                    .category(nq.getTopic().getCategory())
                    .questionText(nq.getQuestionText())
                    .optionA(nq.getOptionA())
                    .optionB(nq.getOptionB())
                    .optionC(nq.getOptionC())
                    .optionD(nq.getOptionD())
                    .difficulty(nq.getDifficulty())
                    .build();

            return MockInterviewSubmitResponse.builder()
                    .mockInterviewId(interview.getId())
                    .currentRound(round)
                    .questionIndex(nextIndex)
                    .nextQuestion(nextQDto)
                    .isFinished(false)
                    .build();
        } else {
            // All questions answered, grade the mock interview
            int javaCorrect = 0;
            int sqlCorrect = 0;
            int dsaCorrect = 0;
            int techCorrect = 0;

            for (int i = 0; i < 20; i++) {
                boolean correct = answers.get(i).isCorrect();
                if (i < 5) {
                    if (correct) javaCorrect++;
                } else if (i < 10) {
                    if (correct) sqlCorrect++;
                } else if (i < 15) {
                    if (correct) dsaCorrect++;
                } else {
                    if (correct) techCorrect++;
                }
            }

            int totalScore = javaCorrect + sqlCorrect + dsaCorrect + techCorrect;

            interview.setJavaScore(javaCorrect);
            interview.setSqlScore(sqlCorrect);
            interview.setDsaScore(dsaCorrect);
            interview.setTechScore(techCorrect);
            interview.setTotalScore(totalScore);
            interview.setEndTime(LocalDateTime.now());

            // Compile dynamic feedback summary
            StringBuilder feedback = new StringBuilder();
            feedback.append("Successfully completed all rounds! ");
            if (javaCorrect >= 4) {
                feedback.append("Exceptional Java skills demonstrated. ");
            } else if (javaCorrect < 3) {
                feedback.append("Need to strengthen Java Core and OOP theory. ");
            }

            if (sqlCorrect >= 4) {
                feedback.append("Excellent understanding of SQL Joins and aggregations. ");
            } else if (sqlCorrect < 3) {
                feedback.append("Review subqueries and transaction locking modes. ");
            }

            if (dsaCorrect >= 4) {
                feedback.append("Strong analytical skills in array and stack manipulation. ");
            } else {
                feedback.append("Practice recursive base-case resolutions and tree traversals. ");
            }

            interview.setFeedbackSummary(feedback.toString());
            MockInterview savedInterview = mockInterviewRepository.save(interview);

            MockInterviewScorecardDto scorecard = buildScorecard(savedInterview, answers);

            return MockInterviewSubmitResponse.builder()
                    .mockInterviewId(savedInterview.getId())
                    .currentRound(4)
                    .questionIndex(20)
                    .isFinished(true)
                    .scorecard(scorecard)
                    .build();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MockInterviewScorecardDto getScorecard(Long userId, Long interviewId) {
        MockInterview m = mockInterviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Mock Interview not found with id: " + interviewId));

        if (!m.getUser().getId().equals(userId)) {
            throw new BadRequestException("This mock interview does not belong to the logged-in user.");
        }

        List<MockInterviewAnswer> answers = mockInterviewAnswerRepository.findAll().stream()
                .filter(a -> a.getMockInterview().getId().equals(m.getId()))
                .sorted(Comparator.comparing(MockInterviewAnswer::getId))
                .collect(Collectors.toList());

        return buildScorecard(m, answers);
    }

    private MockInterviewScorecardDto buildScorecard(MockInterview m, List<MockInterviewAnswer> answers) {
        List<String> strongAreas = new ArrayList<>();
        List<String> weakAreas = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if (m.getJavaScore() >= 4) {
            strongAreas.add("Java Fundamentals");
        } else if (m.getJavaScore() < 3) {
            weakAreas.add("Java Core & OOP");
            recommendations.add("Review abstract classes vs interfaces & collections hierarchy.");
        }

        if (m.getSqlScore() >= 4) {
            strongAreas.add("SQL Queries");
        } else if (m.getSqlScore() < 3) {
            weakAreas.add("Relational Joins & Subqueries");
            recommendations.add("Solve practice tasks on GROUP BY, HAVING, and correlated subqueries.");
        }

        if (m.getDsaScore() >= 4) {
            strongAreas.add("Data Structures & Algorithms");
        } else if (m.getDsaScore() < 3) {
            weakAreas.add("Recursion & Tree Traversals");
            recommendations.add("Trace recursive tree heights and practice stack ordering questions.");
        }

        if (strongAreas.isEmpty()) {
            strongAreas.add("Keep practicing to unlock verified strengths!");
        }
        if (weakAreas.isEmpty()) {
            weakAreas.add("None identified during this session. Good work!");
        }

        return MockInterviewScorecardDto.builder()
                .mockInterviewId(m.getId())
                .totalScore(m.getTotalScore())
                .javaScore(m.getJavaScore())
                .sqlScore(m.getSqlScore())
                .dsaScore(m.getDsaScore())
                .techScore(m.getTechScore())
                .feedbackSummary(m.getFeedbackSummary())
                .strongAreas(strongAreas)
                .weakAreas(weakAreas)
                .recommendations(recommendations)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobRoleDto> getAllJobRoles() {
        return jobRoleRepository.findAll().stream()
                .map(role -> {
                    List<JobRoleSkill> skills = jobRoleSkillRepository.findByJobRoleId(role.getId());
                    List<String> skillNames = skills.stream()
                            .map(s -> s.getTopic().getName())
                            .collect(Collectors.toList());

                    return JobRoleDto.builder()
                            .id(role.getId())
                            .name(role.getName())
                            .description(role.getDescription())
                            .skillsRequired(skillNames)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobRoleReadinessDto getJobReadiness(Long userId, Long jobRoleId) {
        JobRole role = jobRoleRepository.findById(jobRoleId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Role not found with id: " + jobRoleId));

        List<JobRoleSkill> requiredSkills = jobRoleSkillRepository.findByJobRoleId(jobRoleId);
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);

        Map<Long, Double> userSkillMap = userSkills.stream()
                .collect(Collectors.toMap(s -> s.getTopic().getId(), UserSkill::getSkillLevelPercentage));

        Map<String, Double[]> comparison = new HashMap<>();
        double readinessSum = 0;
        int count = requiredSkills.size();

        for (JobRoleSkill rs : requiredSkills) {
            String topicName = rs.getTopic().getName();
            double reqVal = rs.getRequiredWeight();
            double userVal = userSkillMap.getOrDefault(rs.getTopic().getId(), 0.0);

            comparison.put(topicName, new Double[]{reqVal, userVal});

            // Readiness ratio contribution
            double ratio = userVal >= reqVal ? 100.0 : (userVal / reqVal) * 100.0;
            readinessSum += ratio;
        }

        double finalPercentage = count > 0 ? (readinessSum / count) : 0.0;

        return JobRoleReadinessDto.builder()
                .jobRoleId(role.getId())
                .jobRoleName(role.getName())
                .readinessPercentage(Math.round(finalPercentage * 10.0) / 10.0)
                .skillComparison(comparison)
                .build();
    }

    @Override
    @Transactional
    public void selectJobRole(Long userId, Long jobRoleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        JobRole role = jobRoleRepository.findById(jobRoleId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Role not found with id: " + jobRoleId));

        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        profile.setTargetRole(role.getName());
        profileRepository.save(profile);
    }
}
