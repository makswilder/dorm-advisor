package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.ForumThread;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.domain.entity.enums.ForumThreadType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ForumThreadRepository extends JpaRepository<ForumThread, UUID> {

    List<ForumThread> findBySchoolIdAndStatusOrderByCreatedAtDesc(UUID schoolId, ContentStatus status);

    Optional<ForumThread> findBySchoolIdAndType(UUID schoolId, ForumThreadType type);
}