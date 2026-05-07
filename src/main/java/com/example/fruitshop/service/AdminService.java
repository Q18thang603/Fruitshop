package com.example.fruitshop.service;

import com.example.fruitshop.entity.Order;
import com.example.fruitshop.entity.OrderStatus;
import com.example.fruitshop.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final OrderRepository orderRepository;

    public AdminService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 🔥 lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 🔥 cập nhật trạng thái
    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn"));

        order.setStatus(status);
        return orderRepository.save(order);
    }

    // 🔥 doanh thu
    public Double getRevenue() {
        Double revenue = orderRepository.getTotalRevenue();
        return revenue != null ? revenue : 0;
    }
    // 🔥 doanh thu theo ngày
    public List<Object[]> getRevenueByDate() {
        return orderRepository.getRevenueByDate();
    }

    // 🔥 doanh thu theo tháng
    public List<Object[]> getRevenueByMonth() {
        return orderRepository.getRevenueByMonth();
    }

    // 🔥 tổng số đơn
    public long countOrders() {
        return orderRepository.count();
    }
}