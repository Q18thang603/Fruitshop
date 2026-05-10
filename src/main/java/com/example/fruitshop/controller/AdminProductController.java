package com.example.fruitshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fruitshop.entity.Product;
import com.example.fruitshop.service.ProductService;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

	@Autowired
	private ProductService service;

	@PostMapping
	public Product create(@RequestBody Product p) {
		return service.save(p);
	}

	@PutMapping("/{id}")
	public Product update(@PathVariable Long id, @RequestBody Product p) {
		p.setId(id);
		return service.save(p);
	}

	@DeleteMapping("/{id}")
	public String delete(@PathVariable Long id) {
		service.delete(id);
		return "Deleted";
	}
}