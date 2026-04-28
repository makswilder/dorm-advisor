package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.DormQuestion;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DormQuestionRepository extends JpaRepository<DormQuestion, UUID> {

    List<DormQuestion> findByDormIdAndStatusOrderByCreatedAtDesc(UUID dormId, ContentStatus status);

    List<DormQuestion> findByStatus(ContentStatus status);
}