package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.enums.EntityStatus;

public record SchoolUpdateDto(
    String name,
    String city,
    String state,
    EntityStatus status
) {}
