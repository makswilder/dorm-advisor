package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.Review;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByDormId(UUID dormId);

    List<Review> findByDormIdAndStatus(UUID dormId, ContentStatus status);

    List<Review> findByStatus(ContentStatus status);

    @Query("SELECT r.reviewText FROM Review r WHERE r.dorm.id = :dormId AND r.status = :status ORDER BY r.createdAt DESC LIMIT 1")
    Optional<String> findLatestVisibleReviewText(@Param("dormId") UUID dormId, @Param("status") ContentStatus status);
}
