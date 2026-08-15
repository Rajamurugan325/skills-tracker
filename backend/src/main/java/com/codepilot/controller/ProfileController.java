package com.codepilot.controller;

import com.codepilot.dto.ProfileDto;
import com.codepilot.security.UserPrincipal;
import com.codepilot.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProfileDto profile = profileService.getProfileByUserId(userPrincipal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                       @RequestBody ProfileDto profileDto) {
        ProfileDto profile = profileService.updateProfile(userPrincipal.getId(), profileDto);
        return ResponseEntity.ok(profile);
    }
}
