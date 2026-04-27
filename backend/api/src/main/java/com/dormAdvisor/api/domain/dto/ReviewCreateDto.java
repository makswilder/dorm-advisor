package com.dormAdvisor.api.domain.dto;

public record ReviewCreateDto(
    int overall,
    int cleanliness,
    int locationRating,
    int noise,
    int value,
    int social,
    int roomQuality,
    int bathroomRating,
    String reviewText,
    Integer classYear,
    Integer yearLived
) {}
