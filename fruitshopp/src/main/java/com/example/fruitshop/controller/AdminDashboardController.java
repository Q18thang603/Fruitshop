package com.example.fruitshop.controller;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.entity.Order;
import com.example.fruitshop.entity.Product;
import com.example.fruitshop.repository.OrderRepository;
import com.example.fruitshop.repository.ProductRepository;
import com.example.fruitshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.fruitshop.repository.OrderItemRepository orderItemRepository;

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getStats() {
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        
        List<Order> allOrders = orderRepository.findAll();
        double totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        List<Product> allProducts = productRepository.findAll();
        long lowStockCount = allProducts.stream()
                .filter(p -> p.getQuantity() != null && p.getQuantity() < 10)
                .count();

        // Calculate monthly revenue (simple implementation)
        Map<String, Double> monthlyRevenue = new HashMap<>();
        allOrders.stream()
            .filter(o -> !"CANCELLED".equals(o.getStatus()) && o.getCreatedAt() != null)
            .forEach(o -> {
                String month = o.getCreatedAt().getMonth().toString() + " " + o.getCreatedAt().getYear();
                monthlyRevenue.put(month, monthlyRevenue.getOrDefault(month, 0.0) + o.getTotalAmount());
            });

        // Total sold products
        long totalSoldProducts = orderItemRepository.findAll().stream()
            .filter(item -> !"CANCELLED".equals(item.getOrder().getStatus()))
            .mapToLong(com.example.fruitshop.entity.OrderItem::getQuantity)
            .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalUsers", totalUsers);
        stats.put("lowStockCount", lowStockCount);
        stats.put("monthlyRevenue", monthlyRevenue);
        stats.put("totalSoldProducts", totalSoldProducts);

        return ApiResponse.success(stats);
    }

    @GetMapping("/recent-orders")
    public ApiResponse<List<Order>> getRecentOrders() {
        // Get last 5 orders
        List<Order> recentOrders = orderRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        return ApiResponse.success(recentOrders);
    }

    @GetMapping("/low-stock-products")
    public ApiResponse<List<Product>> getLowStockProducts() {
        List<Product> lowStock = productRepository.findAll().stream()
                .filter(p -> p.getQuantity() != null && p.getQuantity() < 10)
                .limit(5)
                .toList();
        return ApiResponse.success(lowStock);
    }
}
