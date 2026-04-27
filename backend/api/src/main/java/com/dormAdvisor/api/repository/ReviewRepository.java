package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.Review;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByDormId(UUID dormId);

    List<Review> findByDormIdAndStatus(UUID dormId, ContentStatus status);
}
