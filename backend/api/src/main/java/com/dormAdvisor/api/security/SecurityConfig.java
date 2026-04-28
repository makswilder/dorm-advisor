package com.dormAdvisor.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/magic-link").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/verify").permitAll()
                // Guest submissions — no JWT required
                .requestMatchers(HttpMethod.POST, "/api/dorms/*/reviews").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/dorms/*/photos").permitAll()
                // Public read — gallery and image serving
                .requestMatchers(HttpMethod.GET, "/api/dorms/*/photos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/photos/**").permitAll()
                // /api/auth/google and /api/auth/google/callback are handled by the OAuth2 DSL
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                // GET /api/auth/google triggers Google redirect
                .authorizationEndpoint(auth -> auth.baseUri("/api/auth"))
                // Google redirects back to /api/auth/google/callback
                .redirectionEndpoint(redirect -> redirect.baseUri("/api/auth/google/callback"))
                .successHandler(oAuth2AuthenticationSuccessHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}