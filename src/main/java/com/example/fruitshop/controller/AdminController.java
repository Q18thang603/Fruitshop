package com.example.fruitshop.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.fruitshop.entity.Order;
import com.example.fruitshop.entity.OrderStatus;
import com.example.fruitshop.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // 🔥 xem tất cả đơn hàng
    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return adminService.getAllOrders();
    }

    // 🔥 cập nhật trạng thái
    @PutMapping("/orders/{id}")
    public Order updateStatus(@PathVariable Long id,
                              @RequestParam OrderStatus status) {
        return adminService.updateStatus(id, status);
    }

    // 🔥 thống kê doanh thu
    @GetMapping("/revenue")
    public Double getRevenue() {
        return adminService.getRevenue();
    }
    // 🔥 doanh thu theo ngày
    @GetMapping("/revenue-by-date")
    public List<Object[]> revenueByDate() {
        return adminService.getRevenueByDate();
    }

    // 🔥 doanh thu theo tháng
    @GetMapping("/revenue-by-month")
    public List<Object[]> revenueByMonth() {
        return adminService.getRevenueByMonth();
    }

    // 🔥 tổng số đơn
    @GetMapping("/count-orders")
    public long countOrders() {
        return adminService.countOrders();
    }
}