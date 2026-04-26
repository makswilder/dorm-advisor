package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.enums.DormCategory;

import java.util.Set;

public record DormCreateDto(
    String name,
    String slug,
    Set<DormCategory> categories
) {}
