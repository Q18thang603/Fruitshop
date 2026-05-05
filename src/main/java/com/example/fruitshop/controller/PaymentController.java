package com.example.fruitshop.controller;

import com.example.fruitshop.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/vnpay/create")
    public String create(@RequestParam Long orderId) {
        return paymentService.createPayment(orderId);
    }

    @GetMapping("/vnpay/return")
    public String vnpayReturn(@RequestParam Map<String, String> params) {
        paymentService.handleReturn(params);
        return "Thanh toán thành công!";
    }
}