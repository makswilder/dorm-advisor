package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.DormAnswerDto;
import com.dormAdvisor.api.domain.dto.DormDto;
import com.dormAdvisor.api.domain.dto.DormQuestionDto;
import com.dormAdvisor.api.domain.dto.ModerationActionDto;
import com.dormAdvisor.api.domain.dto.ReviewDto;
import com.dormAdvisor.api.domain.dto.SchoolDto;
import com.dormAdvisor.api.repository.UserRepository;
import com.dormAdvisor.api.service.ModerationService;
import com.dormAdvisor.api.service.QAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    private final QAService qaService;
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

    @GetMapping("/reviews/all")
    public ResponseEntity<List<ReviewDto>> allReviews() {
        return ResponseEntity.ok(moderationService.getAllVisibleReviews());
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> removeReview(
        @PathVariable UUID id,
        Authentication authentication
    ) {
        log.info("DELETE /api/admin/reviews/{}", id);
        moderationService.rejectReview(id, moderatorId(authentication), null);
        return ResponseEntity.noContent().build();
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

    @GetMapping("/questions/pending")
    public ResponseEntity<List<DormQuestionDto>> pendingQuestions() {
        return ResponseEntity.ok(qaService.getPending());
    }

    @GetMapping("/questions/all")
    public ResponseEntity<List<DormQuestionDto>> allQuestions() {
        return ResponseEntity.ok(qaService.getAllVisibleQuestions());
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> removeQuestion(@PathVariable UUID id) {
        log.info("DELETE /api/admin/questions/{}", id);
        qaService.rejectQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/questions/{id}/approve")
    public ResponseEntity<DormQuestionDto> approveQuestion(@PathVariable UUID id) {
        log.info("POST /api/admin/questions/{}/approve", id);
        return ResponseEntity.ok(qaService.approveQuestion(id));
    }

    @PostMapping("/questions/{id}/reject")
    public ResponseEntity<DormQuestionDto> rejectQuestion(@PathVariable UUID id) {
        log.info("POST /api/admin/questions/{}/reject", id);
        return ResponseEntity.ok(qaService.rejectQuestion(id));
    }

    @GetMapping("/answers/pending")
    public ResponseEntity<List<DormAnswerDto>> pendingAnswers() {
        return ResponseEntity.ok(qaService.getPendingAnswers());
    }

    @GetMapping("/answers/all")
    public ResponseEntity<List<DormAnswerDto>> allAnswers() {
        return ResponseEntity.ok(qaService.getAllVisibleAnswers());
    }

    @DeleteMapping("/answers/{id}")
    public ResponseEntity<Void> removeAnswer(@PathVariable UUID id) {
        log.info("DELETE /api/admin/answers/{}", id);
        qaService.rejectAnswer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/answers/{id}/approve")
    public ResponseEntity<DormAnswerDto> approveAnswer(@PathVariable UUID id) {
        log.info("POST /api/admin/answers/{}/approve", id);
        return ResponseEntity.ok(qaService.approveAnswer(id));
    }

    @PostMapping("/answers/{id}/reject")
    public ResponseEntity<DormAnswerDto> rejectAnswer(@PathVariable UUID id) {
        log.info("POST /api/admin/answers/{}/reject", id);
        return ResponseEntity.ok(qaService.rejectAnswer(id));
    }

    private UUID moderatorId(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmailNormalized(authentication.getName())
            .map(u -> u.getId())
            .orElse(null);
    }
}
