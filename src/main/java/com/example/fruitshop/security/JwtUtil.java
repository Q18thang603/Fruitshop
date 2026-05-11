package com.example.fruitshop.security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private final String SECRET = "12345678901234567890123456789012"; // key 32 ký tự

	private Key getKey() {
		return Keys.hmacShaKeyFor(SECRET.getBytes());
	}

	// tạo token
	public String generateToken(String username, String role) {
		return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
				.signWith(getKey()).compact();
	}

	// lấy username từ token
	public String extractUsername(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody().getSubject();
	}

	// lấy role từ token
	public String extractRole(String token) {
		return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody().get("role", String.class);
	}
}