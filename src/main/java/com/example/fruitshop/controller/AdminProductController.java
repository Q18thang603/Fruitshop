package com.example.fruitshop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.fruitshop.entity.Product;
import com.example.fruitshop.service.ProductService;
import com.example.fruitshop.dto.ApiResponse;
import com.example.fruitshop.dto.ProductRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

	@Autowired
	private ProductService service;

	// Upload directory inside project — served as static resources
	private static final String UPLOAD_DIR = "uploads/";

	private Product mapToEntity(ProductRequest request, Product product) {
		product.setName(request.getName());
		product.setPrice(request.getPrice());
		product.setQuantity(request.getQuantity());
		product.setImage(request.getImage());
		product.setDescription(request.getDescription());
		product.setCategory(request.getCategory());
		return product;
	}

	@GetMapping
	public ApiResponse<List<Product>> getAll() {
		return ApiResponse.success(service.getAll());
	}

	@PostMapping
	public ApiResponse<Product> create(@Valid @RequestBody ProductRequest p) {
		Product product = mapToEntity(p, new Product());
		return ApiResponse.success(service.save(product));
	}

	@PutMapping("/{id}")
	public ApiResponse<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest p) {
		Product existing = service.getById(id);
		
		// If image changed and old image was local, delete it
		if (existing.getImage() != null && !existing.getImage().equals(p.getImage())) {
			deletePhysicalFile(existing.getImage());
		}
		
		Product updated = mapToEntity(p, existing);
		return ApiResponse.success(service.save(updated));
	}

	@DeleteMapping("/{id}")
	public ApiResponse<String> delete(@PathVariable Long id) {
		Product product = service.getById(id);
		if (product != null && product.getImage() != null) {
			deletePhysicalFile(product.getImage());
		}
		service.delete(id);
		return ApiResponse.success("Deleted successfully", null);
	}

	private void deletePhysicalFile(String imagePath) {
		if (imagePath != null && imagePath.startsWith("/uploads/")) {
			String fileName = imagePath.substring("/uploads/".length());
			try {
				Path path = Paths.get(UPLOAD_DIR + fileName);
				Files.deleteIfExists(path);
				System.out.println("Deleted physical file: " + path);
			} catch (IOException e) {
				System.err.println("Failed to delete file: " + imagePath + " - " + e.getMessage());
			}
		}
	}

	@PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<String> uploadImage(@RequestParam("file") MultipartFile file) {
		try {
			if (file.isEmpty()) {
				return ApiResponse.error("File is empty");
			}

			// Ensure upload directory exists
			File uploadDir = new File(UPLOAD_DIR);
			if (!uploadDir.exists()) {
				uploadDir.mkdirs();
			}

			String ext = "";
			String originalName = file.getOriginalFilename();
			if (originalName != null && originalName.contains(".")) {
				ext = originalName.substring(originalName.lastIndexOf("."));
			}

			String fileName = UUID.randomUUID() + ext;
			Path targetPath = Paths.get(UPLOAD_DIR + fileName);
			Files.write(targetPath, file.getBytes());

			// Return the URL path the frontend can use
			String imageUrl = "/uploads/" + fileName;
			return ApiResponse.success("Image uploaded", imageUrl);
		} catch (IOException e) {
			return ApiResponse.error("Failed to upload image: " + e.getMessage());
		}
	}
}