package com.codepilot.service.impl;

import com.codepilot.dto.ProfileDto;
import com.codepilot.entity.Profile;
import com.codepilot.entity.User;
import com.codepilot.exception.ResourceNotFoundException;
import com.codepilot.repository.ProfileRepository;
import com.codepilot.repository.UserRepository;
import com.codepilot.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public ProfileDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Profile newProfile = Profile.builder()
                            .user(user)
                            .targetRole("Software Developer")
                            .primaryLanguage("Java")
                            .summary("Hello, I am preparing for technical interviews!")
                            .build();
                    return profileRepository.save(newProfile);
                });
        return mapToDto(profile);
    }

    @Override
    @Transactional
    public ProfileDto updateProfile(Long userId, ProfileDto profileDto) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));

        profile.setTargetRole(profileDto.getTargetRole());
        profile.setPrimaryLanguage(profileDto.getPrimaryLanguage());
        profile.setSummary(profileDto.getSummary());

        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }

    private ProfileDto mapToDto(Profile profile) {
        User user = profile.getUser();
        return ProfileDto.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .targetRole(profile.getTargetRole())
                .primaryLanguage(profile.getPrimaryLanguage())
                .summary(profile.getSummary())
                .build();
    }
}
