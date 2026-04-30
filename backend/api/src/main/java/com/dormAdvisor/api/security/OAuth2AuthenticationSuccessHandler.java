package com.dormAdvisor.api.security;

import com.dormAdvisor.api.domain.entity.User;
import com.dormAdvisor.api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.jwt.expiry-hours:1}")
    private int jwtExpiryHours;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {
        final var oAuth2User = (OAuth2User) authentication.getPrincipal();
        final String email = oAuth2User.getAttribute("email");
        final String normalized = email.toLowerCase().trim();

        log.info("Google OAuth2 login for email domain: {}", normalized.substring(normalized.indexOf('@')));

        // Google users are never verified students
        final User user = userRepository.findByEmailNormalized(normalized)
            .orElseGet(() -> userRepository.save(
                User.builder()
                    .email(email)
                    .emailNormalized(normalized)
                    .isVerifiedStudent(false)
                    .build()
            ));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        final String jwt = jwtService.generateToken(normalized);

        // Set the HttpOnly cookie and redirect to the frontend callback page.
        // The token never appears in the URL or the JavaScript environment.
        final ResponseCookie cookie = ResponseCookie.from("da_jwt", jwt)
            .httpOnly(true)
            .path("/")
            .maxAge((long) jwtExpiryHours * 3600)
            .sameSite("Lax")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.sendRedirect(frontendUrl + "/auth/callback");
    }
}