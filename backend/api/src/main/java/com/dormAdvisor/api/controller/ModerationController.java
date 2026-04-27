package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.DormDto;
import com.dormAdvisor.api.domain.dto.ModerationActionDto;
import com.dormAdvisor.api.domain.dto.ReviewDto;
import com.dormAdvisor.api.domain.dto.SchoolDto;
import com.dormAdvisor.api.repository.UserRepository;
import com.dormAdvisor.api.service.ModerationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class ModerationController {

    private final ModerationService moderationService;
    private final UserRepository userRepository;

    @GetMapping("/schools/pending")
    public ResponseEntity<List<SchoolDto>> pendingSchools() {
        return ResponseEntity.ok(moderationService.getPendingSchools());
    }

    @GetMapping("/dorms/pending")
    public ResponseEntity<List<DormDto>> pendingDorms() {
        return ResponseEntity.ok(moderationService.getPendingDorms());
    }

    @GetMapping("/reviews/pending")
    public ResponseEntity<List<ReviewDto>> pendingReviews() {
        return ResponseEntity.ok(moderationService.getPendingReviews());
    }

    @PostMapping("/schools/{id}/approve")
    public ResponseEntity<SchoolDto> approveSchool(
        @PathVariable UUID id,
        @RequestBody ModerationActionDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/admin/schools/{}/approve", id);
        return ResponseEntity.ok(moderationService.approveSchool(id, moderatorId(authentication), dto.reason()));
    }

    @PostMapping("/schools/{id}/reject")
    public ResponseEntity<SchoolDto> rejectSchool(
        @PathVariable UUID id,
        @RequestBody ModerationActionDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/admin/schools/{}/reject", id);
        return ResponseEntity.ok(moderationService.rejectSchool(id, moderatorId(authentication), dto.reason()));
    }

    @PostMapping("/dorms/{id}/approve")
    public ResponseEntity<DormDto> approveDorm(
        @PathVariable UUID id,
        @RequestBody ModerationActionDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/admin/dorms/{}/approve", id);
        return ResponseEntity.ok(moderationService.approveDorm(id, moderatorId(authentication), dto.reason()));
    }

    @PostMapping("/dorms/{id}/reject")
    public ResponseEntity<DormDto> rejectDorm(
        @PathVariable UUID id,
        @RequestBody ModerationActionDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/admin/dorms/{}/reject", id);
        return ResponseEntity.ok(moderationService.rejectDorm(id, moderatorId(authentication), dto.reason()));
    }

    @PostMapping("/reviews/{id}/approve")
    public ResponseEntity<ReviewDto> approveReview(
        @PathVariable UUID id,
        @RequestBody ModerationActionDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/admin/reviews/{}/approve", id);
        return ResponseEntity.ok(moderationService.approveReview(id, moderatorId(authentication), dto.reason()));
    }

    @PostMapping("/reviews/{id}/reject")
    public ResponseEntity<ReviewDto> rejectReview(
        @PathVariable UUID id,
        @RequestBody ModerationActionDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/admin/reviews/{}/reject", id);
        return ResponseEntity.ok(moderationService.rejectReview(id, moderatorId(authentication), dto.reason()));
    }

    private UUID moderatorId(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmailNormalized(authentication.getName())
            .map(u -> u.getId())
            .orElse(null);
    }
}
