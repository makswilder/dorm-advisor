package com.dormAdvisor.api.security;

import com.dormAdvisor.api.domain.entity.User;
import com.dormAdvisor.api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    // @Value fields must NOT be final (conflicts with @RequiredArgsConstructor)
    @Value("${app.frontend.url}")
    private String frontendUrl;

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

        // Redirect the browser back to the frontend — the /auth/callback page
        // reads the token from the URL, stores it in localStorage, then navigates home.
        response.sendRedirect(frontendUrl + "/auth/callback?token=" + jwt);
    }
}