package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.SchoolCreateDto;
import com.dormAdvisor.api.domain.dto.SchoolDto;
import com.dormAdvisor.api.domain.dto.SchoolUpdateDto;
import com.dormAdvisor.api.service.SchoolService;
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
@RequestMapping("/api/schools")
public class SchoolController {

    private final SchoolService schoolService;

    @PostMapping
    public ResponseEntity<SchoolDto> create(@RequestBody SchoolCreateDto dto) {
        log.info("POST /api/schools — name: {}", dto.name());
        final var created = schoolService.create(dto);
        return ResponseEntity.created(URI.create("/api/schools/" + created.id())).body(created);
    }

    @GetMapping
    public ResponseEntity<List<SchoolDto>> getAll() {
        return ResponseEntity.ok(schoolService.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SchoolDto>> search(@RequestParam String q) {
        return ResponseEntity.ok(schoolService.search(q));
    }

    @GetMapping("/by-slug/{slug}")
    public ResponseEntity<SchoolDto> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(schoolService.findBySlug(slug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(schoolService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolDto> update(@PathVariable UUID id, @RequestBody SchoolUpdateDto dto) {
        log.info("PUT /api/schools/{}", id);
        return ResponseEntity.ok(schoolService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/schools/{}", id);
        schoolService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
