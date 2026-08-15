package com.codepilot.config;

import com.codepilot.entity.Role;
import com.codepilot.entity.User;
import com.codepilot.entity.Profile;
import com.codepilot.repository.RoleRepository;
import com.codepilot.repository.UserRepository;
import com.codepilot.repository.ProfileRepository;
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
    }
}
