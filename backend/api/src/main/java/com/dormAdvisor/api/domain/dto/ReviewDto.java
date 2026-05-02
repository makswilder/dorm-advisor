package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.Photo;
import com.dormAdvisor.api.domain.entity.Review;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ReviewDto(
    UUID id,
    UUID dormId,
    UUID userId,
    AuthorType authorType,
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
    Integer yearLived,
    boolean isVerifiedAtPost,
    ContentStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<PhotoDto> photos,
    String authorEmail
) {
    public static ReviewDto fromEntity(Review review, List<Photo> photos) {
        return fromEntity(review, photos, null);
    }

    public static ReviewDto fromEntity(Review review, List<Photo> photos, String authorEmail) {
        return new ReviewDto(
            review.getId(),
            review.getDorm().getId(),
            review.getUser() != null ? review.getUser().getId() : null,
            review.getAuthorType(),
            review.getOverall(),
            review.getCleanliness(),
            review.getLocationRating(),
            review.getNoise(),
            review.getValue(),
            review.getSocial(),
            review.getRoomQuality(),
            review.getBathroomRating(),
            review.getReviewText(),
            review.getClassYear(),
            review.getYearLived(),
            review.isVerifiedAtPost(),
            review.getStatus(),
            review.getCreatedAt(),
            review.getUpdatedAt(),
            photos.stream().map(PhotoDto::fromEntity).toList(),
            authorEmail
        );
    }

    public static ReviewDto fromEntity(Review review) {
        return fromEntity(review, List.of());
    }
}
