package com.codepilot.service;

import com.codepilot.dto.AuthRequest;
import com.codepilot.dto.AuthResponse;
import com.codepilot.dto.UserRegisterRequest;

public interface AuthService {
    AuthResponse registerUser(UserRegisterRequest registerRequest);
    AuthResponse loginUser(AuthRequest loginRequest);
}
