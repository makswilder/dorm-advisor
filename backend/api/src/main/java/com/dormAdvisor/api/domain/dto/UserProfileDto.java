package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.User;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileDto(
    UUID id,
    String email,
    boolean isVerifiedStudent,
    UUID verifiedSchoolId,
    LocalDateTime lastLoginAt,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static UserProfileDto fromEntity(User user) {
        return new UserProfileDto(
            user.getId(),
            user.getEmail(),
            user.isVerifiedStudent(),
            user.getVerifiedSchool() != null ? user.getVerifiedSchool().getId() : null,
            user.getLastLoginAt(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
