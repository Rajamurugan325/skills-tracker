package com.codepilot.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    
    @Builder.Default
    private String tokenType = "Bearer";
    
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}
