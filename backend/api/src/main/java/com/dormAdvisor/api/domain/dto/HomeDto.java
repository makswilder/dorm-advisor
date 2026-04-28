package com.dormAdvisor.api.domain.dto;

import java.util.List;

public record HomeDto(
    List<SchoolSummaryDto> topSchools,
    List<DormSummaryDto> topDormsByReviews,
    List<DormSummaryDto> highestRatedDorms
) {}