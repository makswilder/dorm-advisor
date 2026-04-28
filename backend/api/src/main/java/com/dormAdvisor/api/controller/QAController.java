package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.DormAnswerCreateDto;
import com.dormAdvisor.api.domain.dto.DormAnswerDto;
import com.dormAdvisor.api.domain.dto.DormQuestionCreateDto;
import com.dormAdvisor.api.domain.dto.DormQuestionDto;
import com.dormAdvisor.api.service.QAService;
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

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class QAController {

    private final QAService qaService;

    @PostMapping("/dorms/{dormId}/questions")
    public ResponseEntity<DormQuestionDto> createQuestion(
        @PathVariable UUID dormId,
        @RequestBody DormQuestionCreateDto dto
    ) {
        log.info("POST /api/dorms/{}/questions", dormId);
        final var created = qaService.createQuestion(dormId, dto);
        return ResponseEntity.created(URI.create("/api/questions/" + created.id())).body(created);
    }

    @GetMapping("/dorms/{dormId}/questions")
    public ResponseEntity<List<DormQuestionDto>> listQuestions(@PathVariable UUID dormId) {
        return ResponseEntity.ok(qaService.listQuestionsForDorm(dormId));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<DormQuestionDto> getQuestion(@PathVariable UUID id) {
        return ResponseEntity.ok(qaService.getQuestion(id));
    }

    @PostMapping("/questions/{questionId}/answers")
    public ResponseEntity<DormAnswerDto> createAnswer(
        @PathVariable UUID questionId,
        @RequestBody DormAnswerCreateDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/questions/{}/answers", questionId);
        final var created = qaService.createAnswer(questionId, dto, authentication);
        return ResponseEntity.created(URI.create("/api/answers/" + created.id())).body(created);
    }

    @GetMapping("/questions/{questionId}/answers")
    public ResponseEntity<List<DormAnswerDto>> listAnswers(@PathVariable UUID questionId) {
        return ResponseEntity.ok(qaService.listAnswers(questionId));
    }
}
