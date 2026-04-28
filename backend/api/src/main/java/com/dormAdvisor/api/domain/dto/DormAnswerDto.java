package com.dormAdvisor.api.domain.dto;

import com.dormAdvisor.api.domain.entity.DormAnswer;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record DormAnswerDto(
    UUID id,
    UUID questionId,
    UUID userId,
    AuthorType authorType,
    String answerText,
    ContentStatus status,
    LocalDateTime createdAt
) {
    public static DormAnswerDto fromEntity(DormAnswer a) {
        return new DormAnswerDto(
            a.getId(),
            a.getQuestion().getId(),
            a.getUserId(),
            a.getAuthorType(),
            a.getAnswerText(),
            a.getStatus(),
            a.getCreatedAt()
        );
    }
}