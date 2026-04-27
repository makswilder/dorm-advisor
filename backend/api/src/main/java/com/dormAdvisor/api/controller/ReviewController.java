package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.ReviewCreateDto;
import com.dormAdvisor.api.domain.dto.ReviewDto;
import com.dormAdvisor.api.domain.dto.ReviewUpdateDto;
import com.dormAdvisor.api.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/dorms/{dormId}/reviews")
    public ResponseEntity<ReviewDto> create(
        @PathVariable UUID dormId,
        @RequestBody ReviewCreateDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/dorms/{}/reviews", dormId);
        final String userEmail = authentication != null ? authentication.getName() : null;
        final var created = reviewService.create(dormId, dto, userEmail);
        return ResponseEntity.created(URI.create("/api/reviews/" + created.id())).body(created);
    }

    @GetMapping("/dorms/{dormId}/reviews")
    public ResponseEntity<List<ReviewDto>> getByDorm(@PathVariable UUID dormId) {
        return ResponseEntity.ok(reviewService.getByDorm(dormId));
    }

    @GetMapping("/reviews/{id}")
    public ResponseEntity<ReviewDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getById(id));
    }

    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewDto> update(@PathVariable UUID id, @RequestBody ReviewUpdateDto dto) {
        log.info("PUT /api/reviews/{}", id);
        return ResponseEntity.ok(reviewService.update(id, dto));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("DELETE /api/reviews/{}", id);
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}