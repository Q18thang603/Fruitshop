package com.example.fruitshop.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // đánh dấu đây là bảng trong database
@Table(name = "roles") // tên bảng trong MySQL
public class Role {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // khóa chính (id)

	private String name; // tên vai trò (ADMIN, USER)

	// getter
	public Long getId() {
		return id;
	}

	// setter
	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}