package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.School;

import java.util.UUID;

public record SchoolSummaryDto(
    UUID id,
    String name,
    String slug,
    String city,
    String state,
    int totalReviews
) {
    public static SchoolSummaryDto fromSchoolAndCount(School school, int reviewCount) {
        return new SchoolSummaryDto(
            school.getId(),
            school.getName(),
            school.getSlug(),
            school.getCity(),
            school.getState(),
            reviewCount
        );
    }
}