package com.example.fruitshop.controller;

import com.example.fruitshop.dto.AuthResponse;
import com.example.fruitshop.dto.LoginRequest;
import com.example.fruitshop.dto.RegisterRequest;
import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.UserRepository;
import com.example.fruitshop.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername());
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        userRepository.findByUsername(request.getUsername()).ifPresent(user -> {
            throw new RuntimeException("Username đã tồn tại");
        });

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getUsername());

        return new AuthResponse(token, savedUser.getUsername());
    }
}