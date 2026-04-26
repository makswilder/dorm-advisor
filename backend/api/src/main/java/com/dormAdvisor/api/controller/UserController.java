package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.UserProfileDto;
import com.dormAdvisor.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;


@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = "/api/users")
@RestController
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(final Authentication authentication) {
        log.info("Retrieving profile for user: {}", authentication.getName());

        final var profile = userService.getUserProfile(authentication.getName());

        log.info("Retrieved profile for user: {}", authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUserProfile(final Authentication authentication) {
        log.info("DELETE /api/v1/users/me — user: {}", authentication.getName());
        userService.deleteUserProfile(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
