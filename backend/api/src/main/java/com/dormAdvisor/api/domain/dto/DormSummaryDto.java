package com.dormAdvisor.api.domain.dto;

import java.util.UUID;

public record DormSummaryDto(
    UUID dormId,
    String dormName,
    String dormSlug,
    UUID schoolId,
    String schoolName,
    String schoolSlug,
    double avgOverall,
    int reviewCount
) {}