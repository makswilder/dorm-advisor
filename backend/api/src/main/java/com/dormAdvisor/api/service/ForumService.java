package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.ForumPostCreateDto;
import com.dormAdvisor.api.domain.dto.ForumPostDto;
import com.dormAdvisor.api.domain.dto.ForumThreadCreateDto;
import com.dormAdvisor.api.domain.dto.ForumThreadDto;
import com.dormAdvisor.api.domain.entity.ForumPost;
import com.dormAdvisor.api.domain.entity.ForumThread;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.domain.entity.enums.ForumThreadType;
import com.dormAdvisor.api.repository.ForumPostRepository;
import com.dormAdvisor.api.repository.ForumThreadRepository;
import com.dormAdvisor.api.repository.SchoolRepository;
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
public class ForumService {

    private final ForumThreadRepository forumThreadRepository;
    private final ForumPostRepository forumPostRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ForumThreadDto> listThreadsForSchool(UUID schoolId) {
        log.info("Listing forum threads for school: {}", schoolId);
        return forumThreadRepository
            .findBySchoolIdAndStatusOrderByCreatedAtDesc(schoolId, ContentStatus.VISIBLE)
            .stream().map(ForumThreadDto::fromEntity).toList();
    }

    @Transactional
    public ForumThreadDto createThread(UUID schoolId, ForumThreadCreateDto dto, Authentication authentication) {
        log.info("Creating forum thread for school: {}", schoolId);
        final var school = schoolRepository.findById(schoolId)
            .orElseThrow(() -> new EntityNotFoundException("School not found: " + schoolId));
        final var thread = ForumThread.builder()
            .school(school)
            .title(dto.title())
            .type(dto.type())
            .build();
        return ForumThreadDto.fromEntity(forumThreadRepository.save(thread));
    }

    @Transactional(readOnly = true)
    public ForumThreadDto getThread(UUID threadId) {
        return ForumThreadDto.fromEntity(findThreadOrThrow(threadId));
    }

    private static final String ADMIN_EMAIL_NORMALIZED = "maksim@pte.hu";

    @Transactional(readOnly = true)
    public List<ForumPostDto> listPosts(UUID threadId) {
        log.info("Listing posts for thread: {}", threadId);
        return forumPostRepository
            .findByThreadIdAndStatusOrderByCreatedAtDesc(threadId, ContentStatus.VISIBLE)
            .stream()
            .map(p -> {
                boolean admin = p.getUserId() != null &&
                    userRepository.findById(p.getUserId())
                        .map(u -> ADMIN_EMAIL_NORMALIZED.equals(u.getEmailNormalized()))
                        .orElse(false);
                return ForumPostDto.fromEntity(p, admin);
            })
            .toList();
    }

    @Transactional
    public ForumPostDto createPost(UUID threadId, ForumPostCreateDto dto, Authentication authentication) {
        log.info("Creating post for thread: {}", threadId);
        final var thread = findThreadOrThrow(threadId);
        final UUID userId = resolveUserId(authentication);
        final AuthorType authorType = userId != null ? AuthorType.USER : AuthorType.GUEST;
        final var post = ForumPost.builder()
            .thread(thread)
            .userId(userId)
            .authorType(authorType)
            .postText(dto.postText())
            .build();
        return ForumPostDto.fromEntity(forumPostRepository.save(post));
    }

    @Transactional
    public ForumThreadDto getOrCreateSystemThread(UUID schoolId, ForumThreadType type) {
        return forumThreadRepository.findBySchoolIdAndType(schoolId, type)
            .map(ForumThreadDto::fromEntity)
            .orElseGet(() -> {
                final var school = schoolRepository.findById(schoolId)
                    .orElseThrow(() -> new EntityNotFoundException("School not found: " + schoolId));
                final String title = switch (type) {
                    case BEST_DORMS -> "Best dorms at " + school.getName();
                    case WORST_DORMS -> "Worst dorms at " + school.getName();
                    default -> "General discussion at " + school.getName();
                };
                final var thread = ForumThread.builder().school(school).title(title).type(type).build();
                return ForumThreadDto.fromEntity(forumThreadRepository.save(thread));
            });
    }

    private ForumThread findThreadOrThrow(UUID id) {
        return forumThreadRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Thread not found: " + id));
    }

    private UUID resolveUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return null;
        return userRepository.findByEmailNormalized(authentication.getName())
            .map(u -> u.getId()).orElse(null);
    }
}
