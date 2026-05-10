package com.example.fruitshop.controller;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success("All users retrieved", userRepository.findAll());
    }
}
