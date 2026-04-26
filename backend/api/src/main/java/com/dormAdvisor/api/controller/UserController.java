package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.UserCreateDto;
import com.dormAdvisor.api.domain.dto.UserProfileDto;
import com.dormAdvisor.api.domain.dto.UserUpdateDto;
import com.dormAdvisor.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = "/api/users")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileDto> createUser(@RequestBody UserCreateDto dto) {
        log.info("POST /api/users — email: {}", dto.email());
        final var created = userService.createUser(dto);
        return ResponseEntity.created(URI.create("/api/users/me")).body(created);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(final Authentication authentication) {
        log.info("Retrieving profile for user: {}", authentication.getName());
        return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateCurrentUserProfile(
        final Authentication authentication,
        @RequestBody UserUpdateDto dto
    ) {
        log.info("PUT /api/users/me — user: {}", authentication.getName());
        return ResponseEntity.ok(userService.updateUser(authentication.getName(), dto));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUserProfile(final Authentication authentication) {
        log.info("DELETE /api/users/me — user: {}", authentication.getName());
        userService.deleteUserProfile(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
