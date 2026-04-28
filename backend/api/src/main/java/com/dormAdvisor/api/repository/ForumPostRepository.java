package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.ForumPost;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ForumPostRepository extends JpaRepository<ForumPost, UUID> {

    List<ForumPost> findByThreadIdAndStatusOrderByCreatedAtDesc(UUID threadId, ContentStatus status);
}