package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.enums.DormCategory;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;

import java.util.Set;

public record DormUpdateDto(
    String name,
    String description,
    String address,
    EntityStatus status,
    Set<DormCategory> categories
) {}
