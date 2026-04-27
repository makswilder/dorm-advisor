package com.dormAdvisor.api.domain.entity;

import com.dormAdvisor.api.domain.entity.enums.ModActionEnum;
import com.dormAdvisor.api.domain.entity.enums.ModEntityEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "moderation_logs")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", columnDefinition = "mod_entity_enum")
    private ModEntityEnum entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "mod_action_enum")
    private ModActionEnum action;

    @Column(name = "moderator_id")
    private UUID moderatorId;

    private String reason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
