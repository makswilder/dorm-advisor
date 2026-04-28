package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.DormAnswer;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DormAnswerRepository extends JpaRepository<DormAnswer, UUID> {

    List<DormAnswer> findByQuestionIdAndStatusOrderByCreatedAtDesc(UUID questionId, ContentStatus status);

    List<DormAnswer> findByStatus(ContentStatus status);
}