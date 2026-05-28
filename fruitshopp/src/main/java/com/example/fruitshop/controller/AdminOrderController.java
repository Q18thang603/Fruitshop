package com.example.fruitshop.controller;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.entity.Order;
import com.example.fruitshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success("All orders retrieved", orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String status = statusMap.get("status");
        return ApiResponse.success("Order status updated", orderService.updateOrderStatus(id, status));
    }
}
