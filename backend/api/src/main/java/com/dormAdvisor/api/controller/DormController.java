package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.DormCreateDto;
import com.dormAdvisor.api.domain.dto.DormDto;
import com.dormAdvisor.api.domain.dto.DormRankingDto;
import com.dormAdvisor.api.domain.dto.DormUpdateDto;
import com.dormAdvisor.api.domain.entity.enums.DormCategory;
import com.dormAdvisor.api.service.DormService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class DormController {

    private final DormService dormService;

    @PostMapping("/schools/{schoolId}/dorms")
    public ResponseEntity<DormDto> create(@PathVariable UUID schoolId, @RequestBody DormCreateDto dto) {
        log.info("POST /api/schools/{}/dorms — name: {}", schoolId, dto.name());
        final var created = dormService.create(schoolId, dto);
        return ResponseEntity.created(URI.create("/api/dorms/" + created.id())).body(created);
    }

    @GetMapping("/schools/{schoolId}/dorms")
    public ResponseEntity<List<DormDto>> getBySchool(@PathVariable UUID schoolId) {
        return ResponseEntity.ok(dormService.getBySchool(schoolId));
    }

    @GetMapping("/schools/{schoolId}/dorms/rankings")
    public ResponseEntity<List<DormRankingDto>> getRankings(
        @PathVariable UUID schoolId,
        @RequestParam(defaultValue = "3") int minReviews,
        @RequestParam(required = false) DormCategory category
    ) {
        return ResponseEntity.ok(dormService.getRankings(schoolId, minReviews, category));
    }

    @GetMapping("/schools/{schoolId}/dorms/search")
    public ResponseEntity<List<DormDto>> search(@PathVariable UUID schoolId, @RequestParam String q) {
        return ResponseEntity.ok(dormService.search(schoolId, q));
    }

    @GetMapping("/schools/{schoolId}/dorms/by-slug/{slug}")
    public ResponseEntity<DormDto> getBySlug(@PathVariable UUID schoolId, @PathVariable String slug) {
        return ResponseEntity.ok(dormService.getBySchoolAndSlug(schoolId, slug));
    }

    @GetMapping("/dorms/{id}")
    public ResponseEntity<DormDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(dormService.getById(id));
    }

    @PutMapping("/dorms/{id}")
    public ResponseEntity<DormDto> update(@PathVariable UUID id, @RequestBody DormUpdateDto dto) {
        log.info("PUT /api/dorms/{}", id);
        return ResponseEntity.ok(dormService.update(id, dto));
    }

    @DeleteMapping("/dorms/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/dorms/{}", id);
        dormService.delete(id);
        return ResponseEntity.noContent().build();
    }
}