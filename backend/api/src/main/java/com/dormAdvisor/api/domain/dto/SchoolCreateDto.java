package com.dormAdvisor.api.domain.dto;

public record SchoolCreateDto(
    String name,
    String slug,
    String city,
    String state,
    String country
) {}
