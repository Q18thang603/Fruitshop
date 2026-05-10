package com.example.fruitshop.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.dto.LoginRequest;
import com.example.fruitshop.dto.LoginResponse;
import com.example.fruitshop.dto.RegisterRequest;
import com.example.fruitshop.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
		return authService.login(loginRequest);
	}

	@PostMapping("/register")
	public ApiResponse<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
		return authService.register(registerRequest);
	}

	@org.springframework.web.bind.annotation.GetMapping("/me")
	public ApiResponse<LoginResponse> getMe(org.springframework.security.core.Authentication authentication) {
		if (authentication == null) return ApiResponse.error("Unauthorized");
		return authService.getMe(authentication.getName());
	}
}