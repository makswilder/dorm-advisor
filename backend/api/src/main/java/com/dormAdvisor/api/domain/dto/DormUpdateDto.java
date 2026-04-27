package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.enums.DormCategory;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;

import java.util.Set;

public record DormUpdateDto(
    String name,
    EntityStatus status,
    Set<DormCategory> categories
) {}
