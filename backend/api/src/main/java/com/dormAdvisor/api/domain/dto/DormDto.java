package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.Dorm;
import com.dormAdvisor.api.domain.entity.enums.DormCategory;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record DormDto(
    UUID id,
    UUID schoolId,
    String name,
    String slug,
    String description,
    String address,
    EntityStatus status,
    Set<DormCategory> categories,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static DormDto fromEntity(Dorm dorm) {
        return new DormDto(
            dorm.getId(),
            dorm.getSchool().getId(),
            dorm.getName(),
            dorm.getSlug(),
            dorm.getDescription(),
            dorm.getAddress(),
            dorm.getStatus(),
            dorm.getCategories(),
            dorm.getCreatedAt(),
            dorm.getUpdatedAt()
        );
    }
}
