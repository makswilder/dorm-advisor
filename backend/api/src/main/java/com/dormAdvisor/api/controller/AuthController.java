package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.auth.AuthResponseDto;
import com.dormAdvisor.api.domain.dto.auth.MagicLinkRequestDto;
import com.dormAdvisor.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping("/magic-link")
    public ResponseEntity<Map<String, String>> requestMagicLink(@RequestBody MagicLinkRequestDto dto) {
        log.info("Magic link requested");
        authService.sendMagicLink(dto.email());
        // Generic message — never reveal whether the user existed
        return ResponseEntity.ok(Map.of("message", "If that email is valid, a sign-in link has been sent."));
    }

    @GetMapping("/verify")
    public ResponseEntity<AuthResponseDto> verifyToken(@RequestParam String token) {
        log.info("Token verification request for token {}...", token.substring(0, Math.min(8, token.length())));
        return ResponseEntity.ok(authService.verifyToken(token));
    }
}