package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.UserCreateDto;
import com.dormAdvisor.api.domain.dto.UserProfileDto;
import com.dormAdvisor.api.domain.dto.UserUpdateDto;
import com.dormAdvisor.api.domain.entity.User;
import com.dormAdvisor.api.repository.SchoolRepository;
import com.dormAdvisor.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;

    @Transactional
    public UserProfileDto createUser(final UserCreateDto dto) {
        log.info("Creating user with email: {}", dto.email());
        final var normalized = dto.email().toLowerCase().trim();
        final var user = User.builder()
            .email(dto.email())
            .emailNormalized(normalized)
            .isVerifiedStudent(false)
            .build();
        return UserProfileDto.fromEntity(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "users")
    public UserProfileDto getUserProfile(final String email) {
        log.info("Fetching profile for user email: {}", email);
        final var user = getUserByEmail(email);
        return UserProfileDto.fromEntity(user);
    }

    @Transactional
    @CacheEvict(value = "users", key = "#email", beforeInvocation = true)
    public UserProfileDto updateUser(final String email, final UserUpdateDto dto) {
        log.info("Updating user profile for email: {}", email);
        final var user = getUserByEmail(email);
        if (dto.email() != null) {
            user.setEmail(dto.email());
            user.setEmailNormalized(dto.email().toLowerCase().trim());
        }
        if (dto.verifiedSchoolId() != null) {
            final var school = schoolRepository.findById(dto.verifiedSchoolId())
                .orElseThrow(() -> new EntityNotFoundException("School not found: " + dto.verifiedSchoolId()));
            user.setVerifiedSchool(school);
            user.setVerifiedStudent(true);
        }
        return UserProfileDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    @CacheEvict(value = "users", key = "#email", beforeInvocation = true)
    public void deleteUserProfile(final String email) {
        log.info("Request to delete user profile with email: {}", email);
        final var user = getUserByEmail(email);
        userRepository.delete(user);
        log.info("User profile deleted for email: {}", email);
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(final String email) {
        return userRepository.findByEmailNormalized(email.toLowerCase().trim())
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }
}
