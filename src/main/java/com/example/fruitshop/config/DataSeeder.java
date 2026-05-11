package com.example.fruitshop.config;

import com.example.fruitshop.entity.*;
import com.example.fruitshop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            seedRoles();
        }
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (productRepository.count() == 0) {
            seedProducts();
        }
        if (orderRepository.count() == 0) {
            seedOrders();
        }
    }

    private void seedRoles() {
        Role adminRole = new Role();
        adminRole.setName("ROLE_ADMIN");
        roleRepository.save(adminRole);

        Role userRole = new Role();
        userRole.setName("ROLE_USER");
        roleRepository.save(userRole);
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        Role userRole = roleRepository.findByName("ROLE_USER");

        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@fruitshop.com");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setRole(adminRole);
        userRepository.save(admin);

        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("user1@gmail.com");
        user1.setPassword(passwordEncoder.encode("123456"));
        user1.setRole(userRole);
        userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("user2@gmail.com");
        user2.setPassword(passwordEncoder.encode("123456"));
        user2.setRole(userRole);
        userRepository.save(user2);
    }

    private void seedProducts() {
        List<Product> products = Arrays.asList(
            createProduct("Chuối Laba Đà Lạt", 25000.0, 100, "fruit", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/06_bmhz0b.jpg", "Chuối Laba thơm dẻo, đặc sản Đà Lạt."),
            createProduct("Táo đỏ Organic", 85000.0, 50, "fruit", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/01_oay7er.jpg", "Táo đỏ giòn ngọt, nhập khẩu organic."),
            createProduct("Bơ sáp 034", 45000.0, 30, "fruit", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/05_m8z3u7.jpg", "Bơ sáp 034 dài, cơm vàng, hạt nhỏ."),
            createProduct("Cam sành Tiền Giang", 35000.0, 80, "fruit", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/03_u6u3c8.jpg", "Cam sành mọng nước, vị ngọt thanh."),
            createProduct("Súp lơ xanh", 30000.0, 40, "vegetable", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/07_q8u3c9.jpg", "Súp lơ xanh tươi sạch, giàu dinh dưỡng."),
            createProduct("Cà chua bi", 20000.0, 60, "vegetable", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/04_t8u3d1.jpg", "Cà chua bi ngọt lịm, dùng trộn salad."),
            createProduct("Cà rốt hữu cơ", 15000.0, 5, "vegetable", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/08_w8u3e2.jpg", "Cà rốt hữu cơ không thuốc trừ sâu."),
            createProduct("Ổi Đài Loan", 18000.0, 0, "fruit", "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/09_x8u3f3.jpg", "Ổi Đài Loan giòn tan, ít hạt.")
        );
        productRepository.saveAll(products);
    }

    private Product createProduct(String name, Double price, Integer quantity, String category, String image, String desc) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setQuantity(quantity);
        p.setCategory(category);
        p.setImage(image);
        p.setDescription(desc);
        p.setCreatedAt(LocalDateTime.now());
        return p;
    }

    private void seedOrders() {
        User user1 = userRepository.findByUsername("user1");
        List<Product> products = productRepository.findAll();
        
        if (products.isEmpty()) return;

        // Order 1 (Completed)
        Order o1 = new Order();
        o1.setUser(user1);
        o1.setCustomerName("User 1");
        o1.setCustomerPhone("0912345678");
        o1.setCustomerAddress("123 Phố Huế, Hà Nội");
        o1.setPaymentMethod("COD");
        o1.setStatus("COMPLETED");
        o1.setCreatedAt(LocalDateTime.now().minusDays(10));
        o1.setItems(new ArrayList<>());
        
        OrderItem item1 = new OrderItem();
        item1.setOrder(o1);
        item1.setProduct(products.get(0));
        item1.setQuantity(2);
        item1.setPrice(products.get(0).getPrice());
        o1.getItems().add(item1);
        
        o1.setTotalAmount(item1.getPrice() * item1.getQuantity());
        orderRepository.save(o1);

        // Order 2 (Pending)
        Order o2 = new Order();
        o2.setUser(user1);
        o2.setCustomerName("User 1");
        o2.setCustomerPhone("0912345678");
        o2.setCustomerAddress("123 Phố Huế, Hà Nội");
        o2.setPaymentMethod("BANK_TRANSFER");
        o2.setStatus("PENDING");
        o2.setCreatedAt(LocalDateTime.now().minusDays(2));
        o2.setItems(new ArrayList<>());
        
        OrderItem item2 = new OrderItem();
        item2.setOrder(o2);
        item2.setProduct(products.get(1));
        item2.setQuantity(1);
        item2.setPrice(products.get(1).getPrice());
        o2.getItems().add(item2);
        
        o2.setTotalAmount(item2.getPrice() * item2.getQuantity());
        orderRepository.save(o2);

        // Order 3 (Completed, last month)
        Order o3 = new Order();
        o3.setUser(user1);
        o3.setCustomerName("User 1");
        o3.setCustomerPhone("0912345678");
        o3.setCustomerAddress("123 Phố Huế, Hà Nội");
        o3.setPaymentMethod("COD");
        o3.setStatus("COMPLETED");
        o3.setCreatedAt(LocalDateTime.now().minusMonths(1));
        o3.setItems(new ArrayList<>());
        
        OrderItem item3 = new OrderItem();
        item3.setOrder(o3);
        item3.setProduct(products.get(2));
        item3.setQuantity(3);
        item3.setPrice(products.get(2).getPrice());
        o3.getItems().add(item3);
        
        o3.setTotalAmount(item3.getPrice() * item3.getQuantity());
        orderRepository.save(o3);
    }
}
