package com.example.fruitshop.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.dto.LoginRequest;
import com.example.fruitshop.dto.LoginResponse;
import com.example.fruitshop.dto.RegisterRequest;
import com.example.fruitshop.entity.Role;
import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.RoleRepository;
import com.example.fruitshop.repository.UserRepository;
import com.example.fruitshop.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ApiResponse<LoginResponse> login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user != null) {
            boolean passwordMatches = false;
            // Password migration/check logic
            if (!user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$")) {
                if (user.getPassword().equals(loginRequest.getPassword())) {
                    passwordMatches = true;
                    user.setPassword(passwordEncoder.encode(loginRequest.getPassword()));
                    userRepository.save(user);
                }
            } else {
                passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            }

            if (passwordMatches) {
                if (Boolean.FALSE.equals(user.getEnabled())) {
                    return ApiResponse.error("Tài khoản đã bị khóa");
                }
                
                String roleName = user.getRole() != null ? user.getRole().getName() : "ROLE_USER";
                
                if ("USER".equals(roleName)) roleName = "ROLE_USER";
                if ("ADMIN".equals(roleName)) roleName = "ROLE_ADMIN";
                if (!roleName.startsWith("ROLE_")) roleName = "ROLE_" + roleName;

                String token = jwtUtil.generateToken(user.getUsername(), roleName);

                return ApiResponse.success("Login successful", new LoginResponse(token, user.getUsername(), roleName));
            }
        }

        return ApiResponse.error("Sai tài khoản hoặc mật khẩu");
    }

    @Transactional
    public ApiResponse<String> register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ApiResponse.error("Tên tài khoản đã tồn tại");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ApiResponse.error("Email đã được sử dụng");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setCreatedAt(LocalDateTime.now());
        user.setEnabled(true);

        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null) {
            userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }
        user.setRole(userRole);

        userRepository.save(user);
        return ApiResponse.success("Đăng ký thành công", null);
    }

    public ApiResponse<LoginResponse> getMe(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return ApiResponse.error("User not found");

        String roleName = user.getRole() != null ? user.getRole().getName() : "ROLE_USER";
        if ("USER".equals(roleName)) roleName = "ROLE_USER";
        if ("ADMIN".equals(roleName)) roleName = "ROLE_ADMIN";
        if (!roleName.startsWith("ROLE_")) roleName = "ROLE_" + roleName;

        return ApiResponse.success("User verified", new LoginResponse(null, user.getUsername(), roleName));
    }
}
