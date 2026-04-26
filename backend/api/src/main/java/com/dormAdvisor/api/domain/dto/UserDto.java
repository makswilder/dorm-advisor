package com.dormAdvisor.api.domain.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    boolean isVerifiedEmail,
    UUID verifiedSchoolId,
    LocalDateTime lastLoginAt,
    LocalDateTime createdAt
) {
}
