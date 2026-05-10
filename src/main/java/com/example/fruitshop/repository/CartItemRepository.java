package com.example.fruitshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.fruitshop.entity.Cart;
import com.example.fruitshop.entity.CartItem;
import com.example.fruitshop.entity.Product;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	List<CartItem> findByCart(Cart cart);

	Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}