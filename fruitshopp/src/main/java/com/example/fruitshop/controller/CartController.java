package com.example.fruitshop.controller;

import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.dto.CartItemRequest;
import com.example.fruitshop.entity.Cart;
import com.example.fruitshop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ApiResponse<Cart> getCart(Authentication authentication) {
        String username = authentication.getName();
        return ApiResponse.success("Cart retrieved successfully", cartService.getCart(username));
    }

    @PostMapping("/items")
    public ApiResponse<Cart> addToCart(Authentication authentication, @Valid @RequestBody CartItemRequest request) {
        String username = authentication.getName();
        return ApiResponse.success("Item added to cart", cartService.addToCart(username, request));
    }

    @PutMapping("/items/{itemId}")
    public ApiResponse<Cart> updateQuantity(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        String username = authentication.getName();
        return ApiResponse.success("Cart updated", cartService.updateQuantity(username, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<Cart> removeFromCart(Authentication authentication, @PathVariable Long itemId) {
        String username = authentication.getName();
        return ApiResponse.success("Item removed from cart", cartService.removeFromCart(username, itemId));
    }
}
