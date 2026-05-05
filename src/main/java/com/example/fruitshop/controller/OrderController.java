package com.example.fruitshop.controller;

import com.example.fruitshop.entity.Order;
import com.example.fruitshop.entity.User;
import com.example.fruitshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 👉 Tạo đơn hàng
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder() {

        User user = new User();
        user.setId(1L); // 🔥 tạm fix user

        return ResponseEntity.ok(orderService.createOrder(user));
    }

    // 👉 Lấy đơn hàng của user
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders() {

        User user = new User();
        user.setId(1L);

        return ResponseEntity.ok(orderService.getMyOrders(user));
    }
}