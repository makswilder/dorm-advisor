package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.auth.AuthResponseDto;
import com.dormAdvisor.api.domain.entity.LoginToken;
import com.dormAdvisor.api.domain.entity.User;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import com.dormAdvisor.api.repository.LoginTokenRepository;
import com.dormAdvisor.api.repository.SchoolDomainRepository;
import com.dormAdvisor.api.repository.UserRepository;
import com.dormAdvisor.api.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final LoginTokenRepository loginTokenRepository;
    private final SchoolDomainRepository schoolDomainRepository;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Value("${app.auth.token-expiry-minutes:15}")
    private int tokenExpiryMinutes;

    @Value("${app.auth.base-url:http://localhost:8080}")
    private String baseUrl;

    @Transactional
    public void sendMagicLink(String email) {
        final String normalized = email.toLowerCase().trim();
        final String domain = normalized.substring(normalized.indexOf('@') + 1);

        final User user = userRepository.findByEmailNormalized(normalized)
            .orElseGet(() -> userRepository.save(
                User.builder()
                    .email(email)
                    .emailNormalized(normalized)
                    .isVerifiedStudent(false)
                    .build()
            ));

        schoolDomainRepository.findByDomainAndSchoolStatus(domain, EntityStatus.ACTIVE.name())
            .ifPresent(sd -> {
                user.setVerifiedStudent(true);
                user.setVerifiedSchool(sd.getSchool());
                userRepository.save(user);
            });

        final byte[] tokenBytes = new byte[32];
        new SecureRandom().nextBytes(tokenBytes);
        final String rawToken = HexFormat.of().formatHex(tokenBytes);
        final String tokenHash = sha256(rawToken);

        log.info("Generated magic link token {}... for normalized email domain: {}",
            rawToken.substring(0, 8), domain);

        loginTokenRepository.save(
            LoginToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusMinutes(tokenExpiryMinutes))
                .used(false)
                .build()
        );

        emailService.sendMagicLink(
            user.getEmail(),
            baseUrl + "/api/auth/verify?token=" + rawToken
        );
    }

    @Transactional
    public AuthResponseDto verifyToken(String rawToken) {
        log.info("Verifying token {}...", rawToken.substring(0, Math.min(8, rawToken.length())));

        final String hash = sha256(rawToken);

        // Atomic consumption — returns 0 if invalid, expired, or already used
        final int consumed = loginTokenRepository.consumeToken(hash);
        if (consumed == 0) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid, expired, or already used token");
        }

        final LoginToken token = loginTokenRepository.findByTokenHash(hash)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token not found"));

        final User user = token.getUser();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        final String jwt = jwtService.generateToken(user.getEmailNormalized());
        return new AuthResponseDto(jwt, user.isVerifiedStudent());
    }

    private String sha256(String input) {
        try {
            final byte[] hash = MessageDigest.getInstance("SHA-256")
                .digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}