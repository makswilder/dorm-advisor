package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.Photo;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PhotoRepository extends JpaRepository<Photo, UUID> {

    List<Photo> findByDormIdAndStatusOrderByCreatedAtDesc(UUID dormId, ContentStatus status);

    List<Photo> findByDormIdOrderByCreatedAtDesc(UUID dormId);

    List<Photo> findByReviewId(UUID reviewId);
}
