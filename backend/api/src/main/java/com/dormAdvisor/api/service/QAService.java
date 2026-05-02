package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.DormAnswerCreateDto;
import com.dormAdvisor.api.domain.dto.DormAnswerDto;
import com.dormAdvisor.api.domain.dto.DormQuestionCreateDto;
import com.dormAdvisor.api.domain.dto.DormQuestionDto;
import com.dormAdvisor.api.domain.entity.DormAnswer;
import com.dormAdvisor.api.domain.entity.DormQuestion;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.repository.DormAnswerRepository;
import com.dormAdvisor.api.repository.DormQuestionRepository;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class QAService {

    private final DormQuestionRepository dormQuestionRepository;
    private final DormAnswerRepository dormAnswerRepository;
    private final DormRepository dormRepository;
    private final UserRepository userRepository;

    @Transactional
    public DormQuestionDto createQuestion(UUID dormId, DormQuestionCreateDto dto) {
        log.info("Creating question for dorm: {}", dormId);
        final var dorm = dormRepository.findById(dormId)
            .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + dormId));
        final var question = DormQuestion.builder()
            .dorm(dorm)
            .questionText(dto.questionText())
            .status(ContentStatus.VISIBLE)
            .build();
        return DormQuestionDto.fromEntity(dormQuestionRepository.save(question));
    }

    @Transactional(readOnly = true)
    public List<DormQuestionDto> listQuestionsForDorm(UUID dormId) {
        log.info("Listing questions for dorm: {}", dormId);
        return dormQuestionRepository
            .findByDormIdAndStatusOrderByCreatedAtDesc(dormId, ContentStatus.VISIBLE)
            .stream().map(DormQuestionDto::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public DormQuestionDto getQuestion(UUID id) {
        return DormQuestionDto.fromEntity(findQuestionOrThrow(id));
    }

    @Transactional
    public DormAnswerDto createAnswer(UUID questionId, DormAnswerCreateDto dto, Authentication authentication) {
        log.info("Creating answer for question: {}", questionId);
        final var question = findQuestionOrThrow(questionId);
        final UUID userId = resolveUserId(authentication);
        final AuthorType authorType = userId != null ? AuthorType.USER : AuthorType.GUEST;
        final var answer = DormAnswer.builder()
            .question(question)
            .userId(userId)
            .authorType(authorType)
            .answerText(dto.answerText())
            .status(ContentStatus.VISIBLE)
            .build();
        return DormAnswerDto.fromEntity(dormAnswerRepository.save(answer));
    }

    @Transactional(readOnly = true)
    public List<DormAnswerDto> listAnswers(UUID questionId) {
        log.info("Listing answers for question: {}", questionId);
        return dormAnswerRepository
            .findByQuestionIdAndStatusOrderByCreatedAtDesc(questionId, ContentStatus.VISIBLE)
            .stream().map(DormAnswerDto::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<DormQuestionDto> getPending() {
        return dormQuestionRepository.findByStatus(ContentStatus.PENDING)
            .stream().map(DormQuestionDto::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<DormAnswerDto> getPendingAnswers() {
        return dormAnswerRepository.findByStatus(ContentStatus.PENDING)
            .stream().map(DormAnswerDto::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<DormQuestionDto> getAllVisibleQuestions() {
        return dormQuestionRepository.findByStatus(ContentStatus.VISIBLE)
            .stream().map(DormQuestionDto::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public List<DormAnswerDto> getAllVisibleAnswers() {
        return dormAnswerRepository.findByStatus(ContentStatus.VISIBLE).stream()
            .map(a -> {
                String email = a.getUserId() != null
                    ? userRepository.findById(a.getUserId()).map(u -> u.getEmail()).orElse(null)
                    : null;
                return DormAnswerDto.fromEntity(a, email);
            })
            .toList();
    }

    @Transactional
    public DormQuestionDto approveQuestion(UUID id) {
        final var q = findQuestionOrThrow(id);
        q.setStatus(ContentStatus.VISIBLE);
        return DormQuestionDto.fromEntity(dormQuestionRepository.save(q));
    }

    @Transactional
    public DormQuestionDto rejectQuestion(UUID id) {
        final var q = findQuestionOrThrow(id);
        q.setStatus(ContentStatus.REMOVED);
        return DormQuestionDto.fromEntity(dormQuestionRepository.save(q));
    }

    @Transactional
    public DormAnswerDto approveAnswer(UUID id) {
        final var a = findAnswerOrThrow(id);
        a.setStatus(ContentStatus.VISIBLE);
        return DormAnswerDto.fromEntity(dormAnswerRepository.save(a));
    }

    @Transactional
    public DormAnswerDto rejectAnswer(UUID id) {
        final var a = findAnswerOrThrow(id);
        a.setStatus(ContentStatus.REMOVED);
        return DormAnswerDto.fromEntity(dormAnswerRepository.save(a));
    }

    private DormQuestion findQuestionOrThrow(UUID id) {
        return dormQuestionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Question not found: " + id));
    }

    private DormAnswer findAnswerOrThrow(UUID id) {
        return dormAnswerRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Answer not found: " + id));
    }

    private UUID resolveUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return null;
        return userRepository.findByEmailNormalized(authentication.getName())
            .map(u -> u.getId()).orElse(null);
    }
}
