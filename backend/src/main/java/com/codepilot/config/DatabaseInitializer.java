package com.codepilot.config;

import com.codepilot.entity.Role;
import com.codepilot.entity.User;
import com.codepilot.entity.Profile;
import com.codepilot.entity.Question;
import com.codepilot.repository.RoleRepository;
import com.codepilot.repository.UserRepository;
import com.codepilot.repository.ProfileRepository;
import com.codepilot.repository.QuestionRepository;
import com.codepilot.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure roles are created in DB
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_STUDENT").build()));
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

        // Create default admin user if it does not exist
        if (!userRepository.existsByUsername("admin")) {
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(studentRole);

            User admin = User.builder()
                    .username("admin")
                    .email("admin@codepilot.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(roles)
                    .build();
            User savedAdmin = userRepository.save(admin);
            System.out.println(">>> CODEPILOT: Default Admin user seeded successfully: username='admin', password='admin123'");

            // Seed admin profile
            Profile adminProfile = Profile.builder()
                    .user(savedAdmin)
                    .targetRole("Platform Administrator")
                    .primaryLanguage("Java")
                    .summary("System admin profile.")
                    .build();
            profileRepository.save(adminProfile);
            System.out.println(">>> CODEPILOT: Seeded profile for new admin user.");
        } else {
            // Ensure existing admin user has a profile record
            userRepository.findByUsername("admin").ifPresent(adminUser -> {
                if (!profileRepository.existsByUserId(adminUser.getId())) {
                    Profile adminProfile = Profile.builder()
                            .user(adminUser)
                            .targetRole("Platform Administrator")
                            .primaryLanguage("Java")
                            .summary("System admin profile.")
                            .build();
                    profileRepository.save(adminProfile);
                    System.out.println(">>> CODEPILOT: Seeded profile for existing admin user.");
                }
            });
        }

        // Seed Coding Workspace practice challenges if they don't exist
        if (questionRepository.findById(901L).isEmpty()) {
            topicRepository.findById(1L).ifPresent(t -> {
                Question q = Question.builder()
                        .id(901L)
                        .topic(t)
                        .questionText("Write a program to reverse a given input string. The function/program should read standard input or accept parameter details, reverse it, and print/return the reversed result.\n\nInput: 'hello'\nExpected Output: 'olleh'")
                        .optionA("")
                        .optionB("")
                        .optionC("")
                        .optionD("")
                        .correctAnswer("")
                        .explanation("Reversing a string can be done in-place or using string buffer/builders.")
                        .difficulty("EASY")
                        .questionType("CODING")
                        .build();
                questionRepository.save(q);
            });
        }
        if (questionRepository.findById(902L).isEmpty()) {
            topicRepository.findById(19L).ifPresent(t -> {
                Question q = Question.builder()
                        .id(902L)
                        .topic(t)
                        .questionText("Write a program to check if an input integer is prime.\n\nInput: '17'\nExpected Output: 'true'")
                        .optionA("")
                        .optionB("")
                        .optionC("")
                        .optionD("")
                        .correctAnswer("")
                        .explanation("A prime number is only divisible by 1 and itself.")
                        .difficulty("EASY")
                        .questionType("CODING")
                        .build();
                questionRepository.save(q);
            });
        }
        if (questionRepository.findById(906L).isEmpty()) {
            topicRepository.findById(10L).ifPresent(t -> {
                Question q = Question.builder()
                        .id(906L)
                        .topic(t)
                        .questionText("Write a SQL query to calculate the average salary of employees per department. Return department name and the average salary as avg_salary, ordered by avg_salary descending.\n\nExpected table layout:\n- department\n- avg_salary")
                        .optionA("")
                        .optionB("")
                        .optionC("")
                        .optionD("")
                        .correctAnswer("")
                        .explanation("Use GROUP BY department and AVG(salary) aggregate function.")
                        .difficulty("EASY")
                        .questionType("SQL")
                        .build();
                questionRepository.save(q);
            });
        }
        if (questionRepository.findById(907L).isEmpty()) {
            topicRepository.findById(34L).ifPresent(t -> {
                Question q = Question.builder()
                        .id(907L)
                        .topic(t)
                        .questionText("Create a simple landing page with a header centered title 'CodePilot' and a navigation link that says 'Start Compiling'. Use HTML and inline CSS styles.")
                        .optionA("")
                        .optionB("")
                        .optionC("")
                        .optionD("")
                        .correctAnswer("")
                        .explanation("HTML structure with basic centered headers.")
                        .difficulty("EASY")
                        .questionType("WEB")
                        .build();
                questionRepository.save(q);
            });
        }
        if (questionRepository.findById(908L).isEmpty()) {
            topicRepository.findById(47L).ifPresent(t -> {
                Question q = Question.builder()
                        .id(908L)
                        .topic(t)
                        .questionText("Configure a Dockerfile to package a Spring Boot jar file. It should use openjdk:21 base image, copy 'app.jar' from target, and execute it using java command.")
                        .optionA("")
                        .optionB("")
                        .optionC("")
                        .optionD("")
                        .correctAnswer("")
                        .explanation("A standard Dockerfile structure uses FROM, COPY, and CMD directives.")
                        .difficulty("MEDIUM")
                        .questionType("CONFIGURATION")
                        .build();
                questionRepository.save(q);
            });
        }
    }
}
