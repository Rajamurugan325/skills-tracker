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

    @Autowired
    private UserTopicProgressRepository userTopicProgressRepository;

    @Override
    @Transactional
    public MockInterviewStartResponse startInterview(Long userId, MockInterviewStartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String type = (request != null && request.getType() != null) ? request.getType().toUpperCase() : "TECHNICAL";
        List<String> skills = (request != null && request.getSkills() != null) ? request.getSkills() : new ArrayList<>();
        String companyStyle = (request != null && request.getCompanyStyle() != null) ? request.getCompanyStyle().toUpperCase() : "";

        List<Question> round1 = new ArrayList<>();
        List<Question> round2 = new ArrayList<>();
        List<Question> round3 = new ArrayList<>();
        List<Question> round4 = new ArrayList<>();

        String round1Name = "Round 1: Core Programming";
        String round2Name = "Round 2: Databases & Systems";
        String round3Name = "Round 3: Data Structures & Logic";
        String round4Name = "Round 4: Software Design & Tools";

        if ("NON_TECHNICAL".equals(type)) {
            round1 = questionRepository.findRandomByCategory("APTITUDE", 5);
            
            Set<Long> excluded = new HashSet<>();
            round1.forEach(q -> excluded.add(q.getId()));
            Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                    .filter(q -> "APTITUDE".equalsIgnoreCase(q.getTopic().getCategory()))
                    .collect(Collectors.toList());
            if (round2.size() < 5) {
                round2.addAll(questionRepository.findRandomByCategory("APTITUDE", 5 - round2.size()));
            }
            round2.forEach(q -> excluded.add(q.getId()));

            Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                    .filter(q -> "SOFT_SKILLS".equalsIgnoreCase(q.getTopic().getCategory()))
                    .collect(Collectors.toList());
            if (round3.size() < 5) {
                round3.addAll(questionRepository.findRandomByCategory("SOFT_SKILLS", 5 - round3.size()));
            }
            round3.forEach(q -> excluded.add(q.getId()));

            Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                    .filter(q -> "SOFT_SKILLS".equalsIgnoreCase(q.getTopic().getCategory()))
                    .collect(Collectors.toList());
            if (round4.size() < 5) {
                round4.addAll(questionRepository.findRandomByCategory("SOFT_SKILLS", 5 - round4.size()));
            }

            round1Name = "Round 1: Quantitative Aptitude";
            round2Name = "Round 2: Logical & Verbal Reasoning";
            round3Name = "Round 3: Soft Skills & Teamwork";
            round4Name = "Round 4: HR & Leadership Scenarios";

        } else if ("INDIVIDUAL".equals(type) && !skills.isEmpty()) {
            String skill = skills.get(0).toUpperCase();
            round1 = questionRepository.findRandomByCategory(skill, 5);
            
            Set<Long> excluded = new HashSet<>();
            round1.forEach(q -> excluded.add(q.getId()));
            Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                    .filter(q -> q.getTopic().getCategory().equalsIgnoreCase(skill))
                    .collect(Collectors.toList());
            if (round2.size() < 5) {
                round2.addAll(questionRepository.findRandomExcluding(excl2, 5 - round2.size()));
            }
            round2.forEach(q -> excluded.add(q.getId()));
            
            Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                    .filter(q -> q.getTopic().getCategory().equalsIgnoreCase(skill))
                    .collect(Collectors.toList());
            if (round3.size() < 5) {
                round3.addAll(questionRepository.findRandomExcluding(excl3, 5 - round3.size()));
            }
            round3.forEach(q -> excluded.add(q.getId()));
            
            Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                    .filter(q -> q.getTopic().getCategory().equalsIgnoreCase(skill))
                    .collect(Collectors.toList());
            if (round4.size() < 5) {
                round4.addAll(questionRepository.findRandomExcluding(excl4, 5 - round4.size()));
            }

            String skillLabel = getCategoryLabel(skill);
            round1Name = "Round 1: " + skillLabel + " Basics";
            round2Name = "Round 2: " + skillLabel + " Core Concepts";
            round3Name = "Round 3: " + skillLabel + " Advanced Problems";
            round4Name = "Round 4: " + skillLabel + " Practical & Tool Scenarios";

        } else if ("MULTIPLE".equals(type) && !skills.isEmpty()) {
            int numSkills = skills.size();
            List<Question> pool = new ArrayList<>();
            Set<Long> excluded = new HashSet<>();
            int perSkill = 20 / numSkills;
            if (perSkill == 0) perSkill = 1;
            
            for (String skill : skills) {
                Collection<Long> excl = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                List<Question> skillQ = questionRepository.findRandomExcluding(excl, perSkill).stream()
                        .filter(q -> q.getTopic().getCategory().equalsIgnoreCase(skill))
                        .collect(Collectors.toList());
                if (skillQ.size() < perSkill) {
                    skillQ.addAll(questionRepository.findRandomByCategory(skill, perSkill - skillQ.size()));
                }
                skillQ.forEach(q -> excluded.add(q.getId()));
                pool.addAll(skillQ);
            }
            if (pool.size() < 20) {
                Collection<Long> excl = pool.stream().map(Question::getId).collect(Collectors.toList());
                if (excl.isEmpty()) excl = Collections.singleton(-1L);
                pool.addAll(questionRepository.findRandomExcluding(excl, 20 - pool.size()));
            }
            
            round1 = new ArrayList<>(pool.subList(0, 5));
            round2 = new ArrayList<>(pool.subList(5, 10));
            round3 = new ArrayList<>(pool.subList(10, 15));
            round4 = new ArrayList<>(pool.subList(15, 20));

            String skill1 = getCategoryLabel(skills.get(0));
            String skill2 = skills.size() > 1 ? getCategoryLabel(skills.get(1)) : "Secondary Skill";
            round1Name = "Round 1: " + skill1 + " Fundamentals";
            round2Name = "Round 2: " + skill1 + " Applications";
            round3Name = "Round 3: " + skill2 + " Fundamentals";
            round4Name = "Round 4: " + skill2 + " Applications";

        } else if ("PLACEMENT".equals(type)) {
            round1 = questionRepository.findRandomByCategory("APTITUDE", 5);

            Set<Long> excluded = new HashSet<>();
            round1.forEach(q -> excluded.add(q.getId()));
            Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                    .filter(q -> "CS_FUNDAMENTALS".equalsIgnoreCase(q.getTopic().getCategory()) 
                              || "DBMS_CONCEPTS".equalsIgnoreCase(q.getTopic().getCategory())
                              || "NETWORKS".equalsIgnoreCase(q.getTopic().getCategory())
                              || "OPERATING_SYSTEMS".equalsIgnoreCase(q.getTopic().getCategory()))
                    .collect(Collectors.toList());
            if (round2.size() < 5) {
                round2.addAll(questionRepository.findRandomByCategory("CS_FUNDAMENTALS", 5 - round2.size()));
            }
            round2.forEach(q -> excluded.add(q.getId()));

            Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                    .filter(q -> "JAVA".equalsIgnoreCase(q.getTopic().getCategory()) 
                              || "PYTHON".equalsIgnoreCase(q.getTopic().getCategory())
                              || "C".equalsIgnoreCase(q.getTopic().getCategory())
                              || "DSA".equalsIgnoreCase(q.getTopic().getCategory())
                              || "DEVELOPER_TOOLS".equalsIgnoreCase(q.getTopic().getCategory()))
                    .collect(Collectors.toList());
            if (round3.size() < 5) {
                round3.addAll(questionRepository.findRandomByCategory("DSA", 5 - round3.size()));
            }
            round3.forEach(q -> excluded.add(q.getId()));

            Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
            round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                    .filter(q -> "SOFT_SKILLS".equalsIgnoreCase(q.getTopic().getCategory()))
                    .collect(Collectors.toList());
            if (round4.size() < 5) {
                round4.addAll(questionRepository.findRandomByCategory("SOFT_SKILLS", 5 - round4.size()));
            }

            round1Name = "Round 1: Quantitative & Logical Aptitude";
            round2Name = "Round 2: Computer Science Core Theory";
            round3Name = "Round 3: Coding & Developer Tools";
            round4Name = "Round 4: Soft Skills & HR Assessment";

        } else if ("COMPANY".equals(type)) {
            if ("GOOGLE".equals(companyStyle)) {
                round1 = questionRepository.findRandomByCategory("DSA", 5);
                
                Set<Long> excluded = new HashSet<>();
                round1.forEach(q -> excluded.add(q.getId()));
                Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                        .filter(q -> "DSA".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round2.size() < 5) {
                    round2.addAll(questionRepository.findRandomExcluding(excl2, 5 - round2.size()));
                }
                round2.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                        .filter(q -> "OPERATING_SYSTEMS".equalsIgnoreCase(q.getTopic().getCategory())
                                  || "NETWORKS".equalsIgnoreCase(q.getTopic().getCategory())
                                  || "DBMS_CONCEPTS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round3.size() < 5) {
                    round3.addAll(questionRepository.findRandomByCategory("OPERATING_SYSTEMS", 5 - round3.size()));
                }
                round3.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                        .filter(q -> "SOFT_SKILLS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round4.size() < 5) {
                    round4.addAll(questionRepository.findRandomByCategory("SOFT_SKILLS", 5 - round4.size()));
                }

                round1Name = "Round 1: Google Algorithmic Round (DSA)";
                round2Name = "Round 2: Google Data Structures Round (DSA)";
                round3Name = "Round 3: Google Systems & Infrastructure";
                round4Name = "Round 4: Google Googliness & Leadership";

            } else if ("AMAZON".equals(companyStyle)) {
                round1 = questionRepository.findRandomByCategory("DSA", 5);

                Set<Long> excluded = new HashSet<>();
                round1.forEach(q -> excluded.add(q.getId()));
                Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                        .filter(q -> "SQL".equalsIgnoreCase(q.getTopic().getCategory()) || "DBMS_CONCEPTS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round2.size() < 5) {
                    round2.addAll(questionRepository.findRandomByCategory("SQL", 5 - round2.size()));
                }
                round2.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                        .filter(q -> "DEVELOPER_TOOLS".equalsIgnoreCase(q.getTopic().getCategory()) || "CS_FUNDAMENTALS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round3.size() < 5) {
                    round3.addAll(questionRepository.findRandomByCategory("DEVELOPER_TOOLS", 5 - round3.size()));
                }
                round3.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                        .filter(q -> "SOFT_SKILLS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round4.size() < 5) {
                    round4.addAll(questionRepository.findRandomByCategory("SOFT_SKILLS", 5 - round4.size()));
                }

                round1Name = "Round 1: Amazon Coding Assessment (DSA)";
                round2Name = "Round 2: Amazon Databases & Analytics";
                round3Name = "Round 3: Amazon Software Design & Tools";
                round4Name = "Round 4: Amazon Leadership Principles & HR";

            } else {
                round1 = questionRepository.findRandomByCategory("APTITUDE", 5);

                Set<Long> excluded = new HashSet<>();
                round1.forEach(q -> excluded.add(q.getId()));
                Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                        .filter(q -> "C".equalsIgnoreCase(q.getTopic().getCategory()) || "JAVA".equalsIgnoreCase(q.getTopic().getCategory()) || "PYTHON".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round2.size() < 5) {
                    round2.addAll(questionRepository.findRandomByCategory("C", 5 - round2.size()));
                }
                round2.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                        .filter(q -> "DBMS_CONCEPTS".equalsIgnoreCase(q.getTopic().getCategory()) || "SQL".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round3.size() < 5) {
                    round3.addAll(questionRepository.findRandomByCategory("DBMS_CONCEPTS", 5 - round3.size()));
                }
                round3.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                        .filter(q -> "SOFT_SKILLS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round4.size() < 5) {
                    round4.addAll(questionRepository.findRandomByCategory("SOFT_SKILLS", 5 - round4.size()));
                }

                round1Name = "Round 1: TCS NQT Aptitude Round";
                round2Name = "Round 2: TCS Programming Fundamentals";
                round3Name = "Round 3: TCS SQL & DBMS Concepts";
                round4Name = "Round 4: TCS HR & Communication Round";
            }

        } else {
            String language = (!skills.isEmpty()) ? skills.get(0).toUpperCase() : "";
            if ("JAVA".equals(language) || "PYTHON".equals(language) || "C".equals(language)) {
                round1 = questionRepository.findRandomByCategory(language, 5);
                
                Set<Long> excluded = new HashSet<>();
                round1.forEach(q -> excluded.add(q.getId()));
                Collection<Long> excl2 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                
                round2 = questionRepository.findRandomExcluding(excl2, 5).stream()
                        .filter(q -> q.getTopic().getCategory().equalsIgnoreCase(language))
                        .collect(Collectors.toList());
                if (round2.size() < 5) {
                    round2.addAll(questionRepository.findRandomExcluding(excl2, 5 - round2.size()));
                }
                round2.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl3 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round3 = questionRepository.findRandomExcluding(excl3, 5).stream()
                        .filter(q -> "DSA".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round3.size() < 5) {
                    round3.addAll(questionRepository.findRandomByCategory("DSA", 5 - round3.size()));
                }
                round3.forEach(q -> excluded.add(q.getId()));

                Collection<Long> excl4 = excluded.isEmpty() ? Collections.singleton(-1L) : excluded;
                round4 = questionRepository.findRandomExcluding(excl4, 5).stream()
                        .filter(q -> "DEVELOPER_TOOLS".equalsIgnoreCase(q.getTopic().getCategory()))
                        .collect(Collectors.toList());
                if (round4.size() < 5) {
                    round4.addAll(questionRepository.findRandomByCategory("DEVELOPER_TOOLS", 5 - round4.size()));
                }

                String langLabel = getCategoryLabel(language);
                round1Name = "Round 1: " + langLabel + " Fundamentals";
                round2Name = "Round 2: " + langLabel + " Advanced Concepts";
                round3Name = "Round 3: " + langLabel + " DSA Applications";
                round4Name = "Round 4: Technical Tools & IDE Scenarios";
            } else {
                round1 = questionRepository.findRandomByCategory("JAVA", 5);
                round2 = questionRepository.findRandomByCategory("SQL", 5);
                round3 = questionRepository.findRandomByCategory("DSA", 5);
                
                List<Long> excludedIds = new ArrayList<>();
                round1.forEach(q -> excludedIds.add(q.getId()));
                round2.forEach(q -> excludedIds.add(q.getId()));
                round3.forEach(q -> excludedIds.add(q.getId()));
                Collection<Long> excludeList = excludedIds.isEmpty() ? Collections.singleton(-1L) : excludedIds;
                round4 = questionRepository.findRandomExcluding(excludeList, 5);
            }
        }

        List<Question> selectedQuestions = new ArrayList<>();
        selectedQuestions.addAll(round1);
        selectedQuestions.addAll(round2);
        selectedQuestions.addAll(round3);
        selectedQuestions.addAll(round4);

        if (selectedQuestions.size() < 20) {
            Collection<Long> currentIds = selectedQuestions.stream().map(Question::getId).collect(Collectors.toList());
            Collection<Long> excludeList = currentIds.isEmpty() ? Collections.singleton(-1L) : currentIds;
            selectedQuestions.addAll(questionRepository.findRandomExcluding(excludeList, 20 - selectedQuestions.size()));
            
            if (selectedQuestions.size() < 20) {
                throw new BadRequestException("Not enough questions in database to assemble a 20-question mock interview.");
            }
        }

        MockInterview interview = MockInterview.builder()
                .user(user)
                .interviewType(type)
                .selectedSkills(String.join(",", skills))
                .round1Name(round1Name)
                .round2Name(round2Name)
                .round3Name(round3Name)
                .round4Name(round4Name)
                .build();
        MockInterview savedInterview = mockInterviewRepository.save(interview);

        for (Question q : selectedQuestions) {
            MockInterviewAnswer mia = MockInterviewAnswer.builder()
                    .mockInterview(savedInterview)
                    .question(q)
                    .selectedAnswer("")
                    .isCorrect(false)
                    .build();
            mockInterviewAnswerRepository.save(mia);
        }

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

        List<MockInterviewAnswer> answers = mockInterviewAnswerRepository.findAll().stream()
                .filter(a -> a.getMockInterview().getId().equals(interview.getId()))
                .sorted(Comparator.comparing(MockInterviewAnswer::getId))
                .collect(Collectors.toList());

        MockInterviewAnswer currentAnswer = answers.stream()
                .filter(a -> a.getQuestion().getId().equals(request.getQuestionId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Question not mapped in this mock interview."));

        String selected = request.getSelectedAnswer().toUpperCase().trim();
        currentAnswer.setSelectedAnswer(selected);
        currentAnswer.setCorrect(selected.equals(currentAnswer.getQuestion().getCorrectAnswer().toUpperCase().trim()));
        mockInterviewAnswerRepository.save(currentAnswer);

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
            int round = 1;
            if (nextIndex > 15) {
                round = 4;
            } else if (nextIndex > 10) {
                round = 3;
            } else if (nextIndex > 5) {
                round = 2;
            }

            String roundName = "Mock Round";
            if (round == 1) roundName = interview.getRound1Name() != null ? interview.getRound1Name() : "Round 1";
            else if (round == 2) roundName = interview.getRound2Name() != null ? interview.getRound2Name() : "Round 2";
            else if (round == 3) roundName = interview.getRound3Name() != null ? interview.getRound3Name() : "Round 3";
            else if (round == 4) roundName = interview.getRound4Name() != null ? interview.getRound4Name() : "Round 4";

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
                    .roundName(roundName)
                    .questionIndex(nextIndex)
                    .nextQuestion(nextQDto)
                    .isFinished(false)
                    .build();
        } else {
            int r1Correct = 0;
            int r2Correct = 0;
            int r3Correct = 0;
            int r4Correct = 0;

            for (int i = 0; i < 20; i++) {
                boolean correct = answers.get(i).isCorrect();
                if (i < 5) {
                    if (correct) r1Correct++;
                } else if (i < 10) {
                    if (correct) r2Correct++;
                } else if (i < 15) {
                    if (correct) r3Correct++;
                } else {
                    if (correct) r4Correct++;
                }
            }

            int totalScore = r1Correct + r2Correct + r3Correct + r4Correct;

            interview.setJavaScore(r1Correct);
            interview.setSqlScore(r2Correct);
            interview.setDsaScore(r3Correct);
            interview.setTechScore(r4Correct);
            interview.setTotalScore(totalScore);
            interview.setEndTime(LocalDateTime.now());

            StringBuilder feedback = new StringBuilder();
            feedback.append("Successfully completed all rounds! ");
            
            String r1Lbl = interview.getRound1Name() != null ? interview.getRound1Name() : "Round 1";
            String r2Lbl = interview.getRound2Name() != null ? interview.getRound2Name() : "Round 2";
            String r3Lbl = interview.getRound3Name() != null ? interview.getRound3Name() : "Round 3";
            String r4Lbl = interview.getRound4Name() != null ? interview.getRound4Name() : "Round 4";

            if (r1Correct >= 4) {
                feedback.append("Exceptional skills demonstrated in ").append(r1Lbl).append(". ");
            } else if (r1Correct < 3) {
                feedback.append("Review foundational concepts in ").append(r1Lbl).append(". ");
            }

            if (r2Correct >= 4) {
                feedback.append("Excellent performance in ").append(r2Lbl).append(". ");
            } else if (r2Correct < 3) {
                feedback.append("Consider practicing more topics in ").append(r2Lbl).append(". ");
            }

            if (r3Correct >= 4) {
                feedback.append("Strong analytical skills shown in ").append(r3Lbl).append(". ");
            } else if (r3Correct < 3) {
                feedback.append("Strengthen competencies matching ").append(r3Lbl).append(". ");
            }

            if (r4Correct >= 4) {
                feedback.append("Excellent execution in ").append(r4Lbl).append(".");
            } else if (r4Correct < 3) {
                feedback.append("Improve practical understanding for ").append(r4Lbl).append(".");
            }

            interview.setFeedbackSummary(feedback.toString());
            MockInterview savedInterview = mockInterviewRepository.save(interview);

            MockInterviewScorecardDto scorecard = buildScorecard(savedInterview, answers);

            return MockInterviewSubmitResponse.builder()
                    .mockInterviewId(savedInterview.getId())
                    .currentRound(4)
                    .roundName(r4Lbl)
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

        Map<Topic, Integer> topicTotal = new HashMap<>();
        Map<Topic, Integer> topicCorrect = new HashMap<>();

        for (MockInterviewAnswer a : answers) {
            Topic topic = a.getQuestion().getTopic();
            topicTotal.put(topic, topicTotal.getOrDefault(topic, 0) + 1);
            if (a.isCorrect()) {
                topicCorrect.put(topic, topicCorrect.getOrDefault(topic, 0) + 1);
            }
        }

        for (Topic topic : topicTotal.keySet()) {
            int total = topicTotal.get(topic);
            int correct = topicCorrect.getOrDefault(topic, 0);
            double accuracy = (double) correct / total * 100.0;

            if (accuracy >= 80.0) {
                strongAreas.add(topic.getName());
            } else if (accuracy <= 40.0) {
                weakAreas.add(topic.getName());
                recommendations.add("Practice more questions on " + topic.getName() + " to improve your accuracy.");
            }
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
                .round1Name(m.getRound1Name() != null ? m.getRound1Name() : "Round 1")
                .round2Name(m.getRound2Name() != null ? m.getRound2Name() : "Round 2")
                .round3Name(m.getRound3Name() != null ? m.getRound3Name() : "Round 3")
                .round4Name(m.getRound4Name() != null ? m.getRound4Name() : "Round 4")
                .interviewType(m.getInterviewType() != null ? m.getInterviewType() : "TECHNICAL")
                .feedbackSummary(m.getFeedbackSummary())
                .strongAreas(strongAreas)
                .weakAreas(weakAreas)
                .recommendations(recommendations)
                .build();
    }

    private String getCategoryLabel(String category) {
        if (category == null) return "";
        switch (category.toUpperCase()) {
            case "JAVA": return "Java Core";
            case "SQL": return "Database & SQL";
            case "DSA": return "Algorithms (DSA)";
            case "C": return "C Programming";
            case "PYTHON": return "Python Programming";
            case "FULLSTACK": return "Full Stack Web";
            case "DATA_ANALYTICS": return "Data Analytics";
            case "DATA_SCIENCE": return "Data Science";
            case "SOFTWARE_TESTING": return "Software Testing";
            case "AUTOMATION_TESTING": return "Automation Testing";
            case "GIT_GITHUB": return "Git & GitHub";
            case "DEVOPS": return "DevOps & CI/CD";
            case "APTITUDE": return "Aptitude & Logic";
            case "AI_TOOLS": return "AI & AI Tools";
            case "NETWORKS": return "Computer Networks";
            case "OPERATING_SYSTEMS": return "Operating Systems";
            case "DBMS_CONCEPTS": return "DBMS Concepts";
            case "CS_FUNDAMENTALS": return "CS Fundamentals";
            case "SOFT_SKILLS": return "Soft Skills & HR";
            case "DEVELOPER_TOOLS": return "Tools & Env";
            default: return category;
        }
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

        // Calculate average quiz accuracy on these specific job role topics
        List<UserTopicProgress> progresses = userTopicProgressRepository.findByUserId(userId);
        Map<Long, Double> topicQuizAccuracyMap = progresses.stream()
                .collect(Collectors.toMap(p -> p.getTopic().getId(), UserTopicProgress::getAccuracyPercentage));

        double quizAccSum = 0;
        int quizAccCount = 0;
        for (JobRoleSkill rs : requiredSkills) {
            Long topicId = rs.getTopic().getId();
            if (topicQuizAccuracyMap.containsKey(topicId)) {
                quizAccSum += topicQuizAccuracyMap.get(topicId);
                quizAccCount++;
            }
        }
        double avgQuizAccuracy = quizAccCount > 0 ? (quizAccSum / quizAccCount) : 0.0;

        // Calculate average mock interview accuracy on these specific job role topics
        List<MockInterview> userMocks = mockInterviewRepository.findByUserId(userId);
        int correctMockAnswers = 0;
        int totalMockAnswers = 0;
        Set<Long> roleTopicIds = requiredSkills.stream()
                .map(rs -> rs.getTopic().getId())
                .collect(Collectors.toSet());

        for (MockInterview m : userMocks) {
            if (m.getEndTime() != null) {
                List<MockInterviewAnswer> answers = mockInterviewAnswerRepository.findAll().stream()
                        .filter(a -> a.getMockInterview().getId().equals(m.getId()))
                        .collect(Collectors.toList());
                for (MockInterviewAnswer a : answers) {
                    if (roleTopicIds.contains(a.getQuestion().getTopic().getId())) {
                        totalMockAnswers++;
                        if (a.isCorrect()) {
                            correctMockAnswers++;
                        }
                    }
                }
            }
        }
        double avgMockAccuracy = totalMockAnswers > 0 ? ((double) correctMockAnswers / totalMockAnswers * 100.0) : 0.0;

        return JobRoleReadinessDto.builder()
                .jobRoleId(role.getId())
                .jobRoleName(role.getName())
                .readinessPercentage(Math.round(finalPercentage * 10.0) / 10.0)
                .avgQuizAccuracy(Math.round(avgQuizAccuracy * 10.0) / 10.0)
                .avgMockAccuracy(Math.round(avgMockAccuracy * 10.0) / 10.0)
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
