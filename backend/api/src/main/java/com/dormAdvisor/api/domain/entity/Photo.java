package com.dormAdvisor.api.domain.entity;

import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
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
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "dorm_id", nullable = false)
    private UUID dormId;

    @Column(name = "user_id")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "author_type", nullable = false, columnDefinition = "author_type_enum")
    @Builder.Default
    private AuthorType authorType = AuthorType.GUEST;

    @Column(name = "storage_key")
    private String storageKey;

    @Column(name = "url")
    private String url;

    @Column(name = "thumb_url")
    private String thumbUrl;

    private Integer width;

    private Integer height;

    private String caption;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "content_status")
    @Builder.Default
    private ContentStatus status = ContentStatus.PENDING;

    @Column(name = "removed_at")
    private LocalDateTime removedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
