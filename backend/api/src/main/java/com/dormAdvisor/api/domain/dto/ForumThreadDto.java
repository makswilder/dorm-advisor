package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.ForumThread;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.domain.entity.enums.ForumThreadType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ForumThreadDto(
    UUID id,
    UUID schoolId,
    String title,
    ForumThreadType type,
    ContentStatus status,
    LocalDateTime createdAt
) {
    public static ForumThreadDto fromEntity(ForumThread t) {
        return new ForumThreadDto(
            t.getId(),
            t.getSchool().getId(),
            t.getTitle(),
            t.getType(),
            t.getStatus(),
            t.getCreatedAt()
        );
    }
}