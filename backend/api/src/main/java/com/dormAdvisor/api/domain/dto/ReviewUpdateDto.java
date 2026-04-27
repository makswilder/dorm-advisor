package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.enums.ContentStatus;

public record ReviewUpdateDto(
    int overall,
    int cleanliness,
    int locationRating,
    int noise,
    int value,
    int social,
    int roomQuality,
    int bathroomRating,
    String reviewText,
    ContentStatus status
) {}
