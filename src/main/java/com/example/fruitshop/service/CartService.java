package com.example.fruitshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.fruitshop.entity.Cart;
import com.example.fruitshop.entity.CartItem;
import com.example.fruitshop.entity.Product;
import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.CartItemRepository;
import com.example.fruitshop.repository.CartRepository;
import com.example.fruitshop.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

	// =========================
	// 1. Lấy hoặc tạo Cart
	// =========================
	public Cart getOrCreateCart(User user) {
		return cartRepository.findByUser(user).orElseGet(() -> {
			Cart cart = new Cart();
			cart.setUser(user);
			return cartRepository.save(cart);
		});
	}

	// =========================
	// 2. Thêm sản phẩm vào giỏ
	// =========================
	public Cart addToCart(User user, Long productId, int quantity) {

		Cart cart = getOrCreateCart(user);

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

		// Nếu sản phẩm đã có → tăng số lượng
		Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);

		if (existingItem.isPresent()) {
			CartItem item = existingItem.get();
			item.setQuantity(item.getQuantity() + quantity);
			cartItemRepository.save(item);
		} else {
			CartItem newItem = new CartItem();
			newItem.setCart(cart);
			newItem.setProduct(product);
			newItem.setQuantity(quantity);
			cartItemRepository.save(newItem);
		}

		return cart;
	}

	// =========================
	// 3. Lấy danh sách sản phẩm trong giỏ
	// =========================
	public List<CartItem> getCartItems(User user) {
		Cart cart = getOrCreateCart(user);
		return cartItemRepository.findByCart(cart);
	}

	// =========================
	// 4. Cập nhật số lượng
	// =========================
	public void updateQuantity(Long cartItemId, int quantity) {
		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Không tìm thấy item"));

		if (quantity <= 0) {
			cartItemRepository.delete(item);
		} else {
			item.setQuantity(quantity);
			cartItemRepository.save(item);
		}
	}

	// =========================
	// 5. Xóa 1 sản phẩm khỏi giỏ
	// =========================
	public void removeItem(Long cartItemId) {
		if (!cartItemRepository.existsById(cartItemId)) {
			throw new RuntimeException("Item không tồn tại");
		}
		cartItemRepository.deleteById(cartItemId);
	}

	// =========================
	// 6. Xóa toàn bộ giỏ hàng
	// =========================
	public void clearCart(User user) {
		Cart cart = getOrCreateCart(user);
		List<CartItem> items = cartItemRepository.findByCart(cart);
		cartItemRepository.deleteAll(items);
	}

	// =========================
	// 7. Tính tổng tiền
	// =========================
	public double getTotalPrice(User user) {
		List<CartItem> items = getCartItems(user);

		double total = 0;
		for (CartItem item : items) {
			total += item.getProduct().getPrice() * item.getQuantity();
		}

		return total;
	}
}