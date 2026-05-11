package com.example.fruitshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fruitshop.entity.Product;
import com.example.fruitshop.service.ProductService;
import com.example.fruitshop.dto.ApiResponse;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	@Autowired
	private ProductService service;

	@GetMapping
	public ApiResponse<List<Product>> getAll() {
		return ApiResponse.success(service.getAll());
	}

	@GetMapping("/{id}")
	public ApiResponse<Product> getById(@PathVariable Long id) {
		return ApiResponse.success(service.getById(id));
	}
}