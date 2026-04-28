package com.dormAdvisor.api.domain.entity;

import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@ToString(exclude = {"dorm", "user"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dorm_id", nullable = false)
    private Dorm dorm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "author_type", nullable = false)
    @Builder.Default
    private AuthorType authorType = AuthorType.GUEST;

    @Column(name = "overall_rating", nullable = false)
    private int overall;

    @Column(nullable = false)
    private int cleanliness;

    @Column(name = "location", nullable = false)
    private int locationRating;

    @Column(nullable = false)
    private int noise;

    @Column(nullable = false)
    private int value;

    @Column(nullable = false)
    private int social;

    @Column(name = "room_quality", nullable = false)
    private int roomQuality;

    @Column(name = "bathroom", nullable = false)
    private int bathroomRating;

    @Column(name = "review_text", nullable = false)
    private String reviewText;

    @Column(name = "class_year")
    private Integer classYear;

    @Column(name = "year_lived")
    private Integer yearLived;

    @Column(name = "is_verified_at_post", nullable = false)
    @Builder.Default
    private boolean isVerifiedAtPost = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ContentStatus status = ContentStatus.VISIBLE;

    @Column(name = "removed_at")
    private LocalDateTime removedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
