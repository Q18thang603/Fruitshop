package com.example.fruitshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.fruitshop.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}