package com.dormAdvisor.api.security;

import com.dormAdvisor.api.config.CorsConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
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
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    private final CorsConfig corsConfig;

    // Chain 1: handles only the Google OAuth2 flow paths (needs a session for state storage)
    @Bean
    @Order(1)
    public SecurityFilterChain oauth2FilterChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher("/api/auth/oauth2/**", "/api/auth/google/callback")
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(auth -> auth.baseUri("/api/auth/oauth2"))
                .redirectionEndpoint(redirect -> redirect.baseUri("/api/auth/google/callback"))
                .successHandler(oAuth2AuthenticationSuccessHandler)
                .failureHandler(oAuth2AuthenticationFailureHandler)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // Chain 2: stateless JWT chain for all remaining API paths
    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/magic-link").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/auth/verify").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                // Public browsing — no JWT required
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/by-slug/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/*/dorms").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/*/dorms/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/*/dorms/rankings").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/*/dorms/by-slug/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/dorms/*/reviews").permitAll()
                // Q&A and forum public read
                .requestMatchers(HttpMethod.GET, "/api/dorms/*/questions").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/questions/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schools/*/forum/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/forum/**").permitAll()
                // Guest submissions — no JWT required
                .requestMatchers(HttpMethod.POST, "/api/dorms/*/reviews").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/dorms/*/photos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/dorms/*/questions").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/questions/*/answers").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/forum/threads/*/posts").permitAll()
                // Public read — gallery and image serving
                .requestMatchers(HttpMethod.GET, "/api/dorms/*/photos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/photos/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
