package com.example.fruitshop.controller;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.dto.OrderRequest;
import com.example.fruitshop.entity.Order;
import com.example.fruitshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<Order> createOrder(Authentication authentication, @Valid @RequestBody OrderRequest request) {
        String username = authentication.getName();
        return ApiResponse.success("Order created successfully", orderService.createOrder(username, request));
    }

    @GetMapping("/my-orders")
    public ApiResponse<List<Order>> getMyOrders(Authentication authentication) {
        String username = authentication.getName();
        return ApiResponse.success("Orders retrieved", orderService.getMyOrders(username));
    }
}
