package com.codepilot.service;

import com.codepilot.dto.ProfileDto;

public interface ProfileService {
    ProfileDto getProfileByUserId(Long userId);
    ProfileDto updateProfile(Long userId, ProfileDto profileDto);
}
