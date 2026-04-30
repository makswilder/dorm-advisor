package com.dormAdvisor.api.security;

import com.dormAdvisor.api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain chain
    ) throws ServletException, IOException {

        final String token = extractToken(request);
        if (token == null) {
            chain.doFilter(request, response);
            return;
        }
        if (!jwtService.isValid(token)) {
            chain.doFilter(request, response);
            return;
        }

        final String email = jwtService.extractSubject(token);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            userRepository.findByEmailNormalized(email).ifPresent(user -> {
                final var auth = new UsernamePasswordAuthenticationToken(
                    email, null, Collections.emptyList()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }

        chain.doFilter(request, response);
    }

    // Reads the JWT from the HttpOnly cookie first; falls back to the Authorization
    // header so curl / Postman / CLI tools continue to work during development.
    private String extractToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                .filter(c -> "da_jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
        }
        final String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}