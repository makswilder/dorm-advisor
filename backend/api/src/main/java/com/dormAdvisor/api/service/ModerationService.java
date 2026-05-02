package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.DormDto;
import com.dormAdvisor.api.domain.dto.ReviewDto;
import com.dormAdvisor.api.domain.dto.SchoolDto;
import com.dormAdvisor.api.domain.entity.ModerationLog;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import com.dormAdvisor.api.domain.entity.enums.ModActionEnum;
import com.dormAdvisor.api.domain.entity.enums.ModEntityEnum;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.ModerationLogRepository;
import com.dormAdvisor.api.repository.ReviewRepository;
import com.dormAdvisor.api.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class ModerationService {

    private final SchoolRepository schoolRepository;
    private final DormRepository dormRepository;
    private final ReviewRepository reviewRepository;
    private final ModerationLogRepository moderationLogRepository;

    @Transactional(readOnly = true)
    public List<SchoolDto> getPendingSchools() {
        log.info("Fetching pending schools");
        return schoolRepository.findByStatus(EntityStatus.PENDING).stream()
            .map(SchoolDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<DormDto> getPendingDorms() {
        log.info("Fetching pending dorms");
        return dormRepository.findByStatus(EntityStatus.PENDING).stream()
            .map(DormDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getPendingReviews() {
        log.info("Fetching pending reviews");
        return reviewRepository.findByStatus(ContentStatus.PENDING).stream()
            .map(ReviewDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getAllVisibleReviews() {
        log.info("Fetching all visible reviews");
        return reviewRepository.findByStatus(ContentStatus.VISIBLE).stream()
            .map(r -> {
                String email = r.getUser() != null ? r.getUser().getEmail() : null;
                return ReviewDto.fromEntity(r, List.of(), email);
            })
            .toList();
    }

    public SchoolDto approveSchool(UUID id, UUID moderatorId, String reason) {
        log.info("Approving school: {}", id);
        final var school = schoolRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("School not found: " + id));
        school.setStatus(EntityStatus.ACTIVE);
        schoolRepository.save(school);
        log(ModEntityEnum.SCHOOL, id, ModActionEnum.APPROVE, moderatorId, reason);
        return SchoolDto.fromEntity(school);
    }

    public SchoolDto rejectSchool(UUID id, UUID moderatorId, String reason) {
        log.info("Rejecting school: {}", id);
        final var school = schoolRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("School not found: " + id));
        school.setStatus(EntityStatus.REJECTED);
        schoolRepository.save(school);
        log(ModEntityEnum.SCHOOL, id, ModActionEnum.REJECT, moderatorId, reason);
        return SchoolDto.fromEntity(school);
    }

    public DormDto approveDorm(UUID id, UUID moderatorId, String reason) {
        log.info("Approving dorm: {}", id);
        final var dorm = dormRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + id));
        dorm.setStatus(EntityStatus.ACTIVE);
        dormRepository.save(dorm);
        log(ModEntityEnum.DORM, id, ModActionEnum.APPROVE, moderatorId, reason);
        return DormDto.fromEntity(dorm);
    }

    public DormDto rejectDorm(UUID id, UUID moderatorId, String reason) {
        log.info("Rejecting dorm: {}", id);
        final var dorm = dormRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + id));
        dorm.setStatus(EntityStatus.REJECTED);
        dormRepository.save(dorm);
        log(ModEntityEnum.DORM, id, ModActionEnum.REJECT, moderatorId, reason);
        return DormDto.fromEntity(dorm);
    }

    @CacheEvict(value = "schoolRankings", allEntries = true)
    public ReviewDto approveReview(UUID id, UUID moderatorId, String reason) {
        log.info("Approving review: {}", id);
        final var review = reviewRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Review not found: " + id));
        review.setStatus(ContentStatus.VISIBLE);
        reviewRepository.save(review);
        log(ModEntityEnum.REVIEW, id, ModActionEnum.APPROVE, moderatorId, reason);
        return ReviewDto.fromEntity(review);
    }

    @CacheEvict(value = "schoolRankings", allEntries = true)
    public ReviewDto rejectReview(UUID id, UUID moderatorId, String reason) {
        log.info("Rejecting review: {}", id);
        final var review = reviewRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Review not found: " + id));
        review.setStatus(ContentStatus.REMOVED);
        reviewRepository.save(review);
        log(ModEntityEnum.REVIEW, id, ModActionEnum.REJECT, moderatorId, reason);
        return ReviewDto.fromEntity(review);
    }

    private void log(ModEntityEnum entityType, UUID entityId, ModActionEnum action, UUID moderatorId, String reason) {
        moderationLogRepository.save(ModerationLog.builder()
            .entityType(entityType)
            .entityId(entityId)
            .action(action)
            .moderatorId(moderatorId)
            .reason(reason)
            .build());
    }
}
