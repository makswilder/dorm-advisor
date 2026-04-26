package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.UserProfileDto;
import com.dormAdvisor.api.domain.entity.User;
import com.dormAdvisor.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    @Cacheable(value = "users")
    public UserProfileDto getUserProfile(final String email) {
        log.info("Fetching profile for user email: {}", email);
        final var user = getUserByEmail(email);
        return UserProfileDto.fromEntity(user);
    }

    @Transactional
    @CacheEvict(value = "users", key = "#userId", beforeInvocation = true)
    public void deleteUserProfile(final String email) {
        log.info("Request to delete user profile with email: {}", email);
        final var user = getUserByEmail(email);
        userRepository.delete(user);
        log.info("User profile deleted for email: {}", email);
    }

    public User getUserByEmail(final String email) {
        return userRepository.findByEmailNormalized(email.toLowerCase().trim())
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }
}
