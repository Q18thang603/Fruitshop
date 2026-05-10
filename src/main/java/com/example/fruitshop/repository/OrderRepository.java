package com.example.fruitshop.repository;

import com.example.fruitshop.entity.Order;
import com.example.fruitshop.entity.OrderStatus;
import com.example.fruitshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // 👉 thống kê doanh thu
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = com.example.fruitshop.entity.OrderStatus.COMPLETED")
    Double getTotalRevenue();
    // 🔥 1. Doanh thu theo ngày
    @Query("""
SELECT DATE(o.createdAt), SUM(o.totalPrice)
FROM Order o
WHERE o.status = com.example.fruitshop.entity.OrderStatus.COMPLETED
GROUP BY DATE(o.createdAt)
ORDER BY DATE(o.createdAt)
""")
    List<Object[]> getRevenueByDate();


    // 🔥 2. Doanh thu theo tháng
    @Query("""
SELECT FUNCTION('MONTH', o.createdAt), SUM(o.totalPrice)
FROM Order o
WHERE o.status = com.example.fruitshop.entity.OrderStatus.COMPLETED
GROUP BY FUNCTION('MONTH', o.createdAt)
ORDER BY FUNCTION('MONTH', o.createdAt)
""")
    List<Object[]> getRevenueByMonth();


    // 🔥 3. Tổng số đơn
    long count();
    List<Order> findByUser(User user);
}