package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.SchoolCreateDto;
import com.dormAdvisor.api.domain.dto.SchoolDto;
import com.dormAdvisor.api.domain.dto.SchoolUpdateDto;
import com.dormAdvisor.api.domain.entity.School;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import com.dormAdvisor.api.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;

    @Transactional
    public SchoolDto create(SchoolCreateDto dto) {
        log.info("Creating school: {}", dto.name());
        final var school = School.builder()
            .name(dto.name())
            .slug(dto.slug())
            .city(dto.city())
            .state(dto.state())
            .country(dto.country())
            .build();
        return SchoolDto.fromEntity(schoolRepository.save(school));
    }

    @Transactional(readOnly = true)
    public SchoolDto getById(UUID id) {
        log.info("Fetching school: {}", id);
        return SchoolDto.fromEntity(findByIdOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<SchoolDto> getAll() {
        log.info("Fetching all schools");
        return schoolRepository.findAll().stream()
            .map(SchoolDto::fromEntity)
            .toList();
    }

    @Transactional
    public SchoolDto update(UUID id, SchoolUpdateDto dto) {
        log.info("Updating school: {}", id);
        final var school = findByIdOrThrow(id);
        if (dto.name() != null) school.setName(dto.name());
        if (dto.city() != null) school.setCity(dto.city());
        if (dto.state() != null) school.setState(dto.state());
        if (dto.status() != null) school.setStatus(dto.status());
        return SchoolDto.fromEntity(schoolRepository.save(school));
    }

    @Transactional
    public void delete(UUID id) {
        log.info("Deleting school: {}", id);
        schoolRepository.delete(findByIdOrThrow(id));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "schoolSearch", key = "#q.toLowerCase()")
    public List<SchoolDto> search(String q) {
        log.info("Searching schools: {}", q);
        return schoolRepository.findByNameContainingIgnoreCaseAndStatus(q, EntityStatus.ACTIVE).stream()
            .map(SchoolDto::fromEntity)
            .toList();
    }

    @Transactional(readOnly = true)
    public SchoolDto findBySlug(String slug) {
        log.info("Fetching school by slug: {}", slug);
        return SchoolDto.fromEntity(
            schoolRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("School not found: " + slug))
        );
    }

    private School findByIdOrThrow(UUID id) {
        return schoolRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("School not found: " + id));
    }
}
