package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.DormCreateDto;
import com.dormAdvisor.api.domain.dto.DormDto;
import com.dormAdvisor.api.domain.dto.DormUpdateDto;
import com.dormAdvisor.api.domain.entity.Dorm;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class DormService {

    private final DormRepository dormRepository;
    private final SchoolRepository schoolRepository;

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

    public DormDto getById(UUID id) {
        log.info("Fetching dorm: {}", id);
        return DormDto.fromEntity(findByIdOrThrow(id));
    }

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

    private Dorm findByIdOrThrow(UUID id) {
        return dormRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + id));
    }
}
