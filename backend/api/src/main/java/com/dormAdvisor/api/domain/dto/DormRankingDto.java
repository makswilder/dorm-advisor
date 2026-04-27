package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.Dorm;
import com.dormAdvisor.api.domain.entity.DormAggregate;

import java.util.UUID;

public record DormRankingDto(
    UUID dormId,
    String dormName,
    String dormSlug,
    double avgOverall,
    int reviewCount,
    Double avgCleanliness,
    Double avgLocation,
    Double avgNoise,
    Double avgValue,
    Double avgSocial,
    Double avgRoomQuality,
    Double avgBathroom,
    String reviewSnippet
) {
    public static DormRankingDto fromAggregate(DormAggregate da, Dorm dorm, String snippet) {
        return new DormRankingDto(
            da.getDormId(),
            dorm.getName(),
            dorm.getSlug(),
            da.getAvgOverall(),
            da.getReviewCount(),
            da.getAvgCleanliness(),
            da.getAvgLocation(),
            da.getAvgNoise(),
            da.getAvgValue(),
            da.getAvgSocial(),
            da.getAvgRoomQuality(),
            da.getAvgBathroom(),
            snippet
        );
    }
}
