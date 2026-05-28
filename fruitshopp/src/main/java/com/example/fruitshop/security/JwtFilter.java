package com.example.fruitshop.security;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.fruitshop.entity.User;
import com.example.fruitshop.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;

	public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
		this.jwtUtil = jwtUtil;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7).trim();

		try {
			String username = jwtUtil.extractUsername(token);
			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				User user = userRepository.findByUsername(username);
				
				String roleName = null;
				if (user != null && user.getRole() != null) {
					roleName = user.getRole().getName();
				}
				
				// Fallback to role from token if not in DB or user not found
				if (roleName == null) {
					roleName = jwtUtil.extractRole(token);
					System.out.println("JWT_FILTER: Role from token: " + roleName);
				}

				if (roleName != null) {
					roleName = roleName.toUpperCase().trim();
					if (!roleName.startsWith("ROLE_")) {
						roleName = "ROLE_" + roleName;
					}
					
					List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(roleName));

					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
							username, null, authorities);
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
		} catch (Exception e) {
			// Ignore
		}

		filterChain.doFilter(request, response);
	}
}