package com.codepilot.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long userId;
    private String username;
    private String email;
    private String targetRole;
    private String primaryLanguage;
    private String summary;
}
