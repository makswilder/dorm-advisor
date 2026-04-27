package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.School;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record SchoolDto(
    UUID id,
    String name,
    String slug,
    String city,
    String state,
    String country,
    EntityStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static SchoolDto fromEntity(School school) {
        return new SchoolDto(
            school.getId(),
            school.getName(),
            school.getSlug(),
            school.getCity(),
            school.getState(),
            school.getCountry(),
            school.getStatus(),
            school.getCreatedAt(),
            school.getUpdatedAt()
        );
    }
}
