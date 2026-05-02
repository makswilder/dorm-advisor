package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.ForumPost;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumPostDto(
    UUID id,
    UUID threadId,
    UUID userId,
    AuthorType authorType,
    String postText,
    ContentStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean isAdmin
) {
    public static ForumPostDto fromEntity(ForumPost p) {
        return fromEntity(p, false);
    }

    public static ForumPostDto fromEntity(ForumPost p, boolean isAdmin) {
        return new ForumPostDto(
            p.getId(),
            p.getThread().getId(),
            p.getUserId(),
            p.getAuthorType(),
            p.getPostText(),
            p.getStatus(),
            p.getCreatedAt(),
            p.getUpdatedAt(),
            isAdmin
        );
    }
}
