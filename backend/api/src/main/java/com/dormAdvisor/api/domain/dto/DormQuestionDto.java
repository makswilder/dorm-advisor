package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.DormQuestion;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record DormQuestionDto(
    UUID id,
    UUID dormId,
    String questionText,
    ContentStatus status,
    LocalDateTime createdAt
) {
    public static DormQuestionDto fromEntity(DormQuestion q) {
        return new DormQuestionDto(
            q.getId(),
            q.getDorm().getId(),
            q.getQuestionText(),
            q.getStatus(),
            q.getCreatedAt()
        );
    }
}