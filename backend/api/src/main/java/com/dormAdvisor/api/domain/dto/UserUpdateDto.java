package com.dormAdvisor.api.domain.dto;

import java.util.UUID;

public record UserUpdateDto(String email, UUID verifiedSchoolId, String displayName, String avatarEmoji) {}