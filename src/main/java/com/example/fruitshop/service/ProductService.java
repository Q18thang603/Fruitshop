package com.example.fruitshop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.fruitshop.entity.Product;
import com.example.fruitshop.repository.ProductRepository;

@Service
public class ProductService {

	@Autowired
	private ProductRepository repo;

	public List<Product> getAll() {
		return repo.findAll();
	}

	public Product getById(Long id) {
		return repo.findById(id).orElse(null);
	}

	public Product save(Product p) {
		return repo.save(p);
	}

	public void delete(Long id) {
		repo.deleteById(id);
	}
}