package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.Photo;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record PhotoDto(
    UUID id,
    UUID dormId,
    UUID reviewId,
    String url,
    String thumbUrl,
    Integer width,
    Integer height,
    String caption,
    ContentStatus status,
    LocalDateTime createdAt
) {
    public static PhotoDto fromEntity(Photo photo) {
        return new PhotoDto(
            photo.getId(),
            photo.getDormId(),
            photo.getReviewId(),
            "/api/photos/" + photo.getId(),
            "/api/photos/" + photo.getId() + "/thumb",
            photo.getWidth(),
            photo.getHeight(),
            photo.getCaption(),
            photo.getStatus(),
            photo.getCreatedAt()
        );
    }
}
