package com.example.fruitshop.service;

import com.example.fruitshop.dto.CartItemRequest;
import com.example.fruitshop.entity.Cart;
import com.example.fruitshop.entity.CartItem;
import com.example.fruitshop.entity.Product;
import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.CartItemRepository;
import com.example.fruitshop.repository.CartRepository;
import com.example.fruitshop.repository.ProductRepository;
import com.example.fruitshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Cart getCart(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    public Cart addToCart(String username, CartItemRequest request) {
        Cart cart = getCart(username);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String username, Long cartItemId, Integer quantity) {
        Cart cart = getCart(username);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return getCart(username);
    }

    public Cart removeFromCart(String username, Long cartItemId) {
        Cart cart = getCart(username);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your cart item");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return cartRepository.save(cart);
    }
}
