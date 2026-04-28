package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.DormCreateDto;
import com.dormAdvisor.api.domain.dto.DormDto;
import com.dormAdvisor.api.domain.dto.DormRankingDto;
import com.dormAdvisor.api.domain.dto.DormUpdateDto;
import com.dormAdvisor.api.domain.entity.Dorm;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.domain.entity.enums.DormCategory;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import com.dormAdvisor.api.repository.DormAggregateRepository;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.ReviewRepository;
import com.dormAdvisor.api.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class DormService {

    private final DormRepository dormRepository;
    private final SchoolRepository schoolRepository;
    private final DormAggregateRepository dormAggregateRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public DormDto create(UUID schoolId, DormCreateDto dto) {
        log.info("Creating dorm '{}' for school: {}", dto.name(), schoolId);
        final var school = schoolRepository.findById(schoolId)
            .orElseThrow(() -> new EntityNotFoundException("School not found: " + schoolId));
        final var dorm = Dorm.builder()
            .school(school)
            .name(dto.name())
            .slug(dto.slug())
            .categories(dto.categories() != null ? new HashSet<>(dto.categories()) : new HashSet<>())
            .build();
        return DormDto.fromEntity(dormRepository.save(dorm));
    }

    @Transactional(readOnly = true)
    public DormDto getById(UUID id) {
        log.info("Fetching dorm: {}", id);
        return DormDto.fromEntity(findByIdOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<DormDto> getBySchool(UUID schoolId) {
        log.info("Fetching dorms for school: {}", schoolId);
        return dormRepository.findBySchoolId(schoolId).stream()
            .map(DormDto::fromEntity)
            .toList();
    }

    @Transactional
    public DormDto update(UUID id, DormUpdateDto dto) {
        log.info("Updating dorm: {}", id);
        final var dorm = findByIdOrThrow(id);
        if (dto.name() != null) dorm.setName(dto.name());
        if (dto.status() != null) dorm.setStatus(dto.status());
        if (dto.categories() != null) dorm.setCategories(new HashSet<>(dto.categories()));
        return DormDto.fromEntity(dormRepository.save(dorm));
    }

    @Transactional
    public void delete(UUID id) {
        log.info("Deleting dorm: {}", id);
        dormRepository.delete(findByIdOrThrow(id));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "schoolRankings", key = "#schoolId + '-' + #minReviews + '-' + #category")
    public List<DormRankingDto> getRankings(UUID schoolId, int minReviews, DormCategory category) {
        log.info("Fetching rankings for school: {} minReviews: {} category: {}", schoolId, minReviews, category);
        final var aggregates = category != null
            ? dormAggregateRepository.findRankedBySchoolAndCategory(schoolId, minReviews, category.name())
            : dormAggregateRepository.findRankedBySchool(schoolId, minReviews);
        return aggregates.stream()
            .map(da -> {
                final var dorm = dormRepository.findById(da.getDormId())
                    .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + da.getDormId()));
                final String raw = reviewRepository.findLatestVisibleReviewText(da.getDormId(), ContentStatus.VISIBLE).orElse(null);
                final String snippet = raw != null && raw.length() > 140 ? raw.substring(0, 140) : raw;
                return DormRankingDto.fromAggregate(da, dorm, snippet);
            })
            .toList();
    }

    @Transactional(readOnly = true)
    public DormDto getBySchoolAndSlug(UUID schoolId, String slug) {
        log.info("Fetching dorm by school: {} slug: {}", schoolId, slug);
        return DormDto.fromEntity(
            dormRepository.findBySchoolIdAndSlug(schoolId, slug)
                .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + slug))
        );
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "dormSearch", key = "#schoolId + ':' + #q.toLowerCase()")
    public List<DormDto> search(UUID schoolId, String q) {
        log.info("Searching dorms for school: {} q: {}", schoolId, q);
        return dormRepository.findBySchoolIdAndNameContainingIgnoreCaseAndStatus(schoolId, q, EntityStatus.ACTIVE).stream()
            .map(DormDto::fromEntity)
            .toList();
    }

    private Dorm findByIdOrThrow(UUID id) {
        return dormRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + id));
    }
}
