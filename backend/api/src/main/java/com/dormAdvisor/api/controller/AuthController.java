package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.auth.MagicLinkRequestDto;
import com.dormAdvisor.api.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // @Value fields must NOT be final
    @Value("${app.jwt.expiry-hours:1}")
    private int jwtExpiryHours;

    @PostMapping("/magic-link")
    public ResponseEntity<Map<String, String>> requestMagicLink(@RequestBody MagicLinkRequestDto dto) {
        log.info("Magic link requested");
        authService.sendMagicLink(dto.email());
        return ResponseEntity.ok(Map.of("message", "If that email is valid, a sign-in link has been sent."));
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Boolean>> verifyToken(
        @RequestParam String token,
        HttpServletResponse response
    ) {
        log.info("Token verification request for token {}...", token.substring(0, Math.min(8, token.length())));
        final var authResponse = authService.verifyToken(token);
        setAuthCookie(response, authResponse.token());
        return ResponseEntity.ok(Map.of("isVerifiedStudent", authResponse.isVerifiedStudent()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        log.info("Logout request");
        final ResponseCookie expiredCookie = ResponseCookie.from("da_jwt", "")
            .httpOnly(true)
            .path("/")
            .maxAge(0)
            .sameSite("Lax")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
        return ResponseEntity.noContent().build();
    }

    private void setAuthCookie(HttpServletResponse response, String jwt) {
        final ResponseCookie cookie = ResponseCookie.from("da_jwt", jwt)
            .httpOnly(true)
            .path("/")
            .maxAge((long) jwtExpiryHours * 3600)
            .sameSite("Lax")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}