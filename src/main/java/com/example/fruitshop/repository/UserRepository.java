package com.example.fruitshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.fruitshop.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	// 🔍 Tìm user theo username (dùng cho login + JWT)
	User findByUsername(String username);

	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
}