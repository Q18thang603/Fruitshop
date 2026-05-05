package com.example.fruitshop.controller;

import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.UserRepository;
import com.example.fruitshop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;
	@Autowired
	private UserRepository userRepository;
	@PostMapping("/add")
	public ResponseEntity<?> addToCart(
			@RequestParam Long productId,
			@RequestParam int quantity) {

		User user = userRepository.findById(1L)
				.orElseThrow(() -> new RuntimeException("User không tồn tại"));

		return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
	}

	@GetMapping
	public ResponseEntity<?> getCart(@AuthenticationPrincipal User user) {
		return ResponseEntity.ok(cartService.getCartItems(user));
	}

	@DeleteMapping("/remove/{id}")
	public ResponseEntity<?> remove(@PathVariable Long id) {
		cartService.removeItem(id);
		return ResponseEntity.ok("Deleted");
	}
}