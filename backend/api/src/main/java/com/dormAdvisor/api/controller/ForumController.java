package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.ForumPostCreateDto;
import com.dormAdvisor.api.domain.dto.ForumPostDto;
import com.dormAdvisor.api.domain.dto.ForumThreadCreateDto;
import com.dormAdvisor.api.domain.dto.ForumThreadDto;
import com.dormAdvisor.api.domain.entity.enums.ForumThreadType;
import com.dormAdvisor.api.service.ForumService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
public class ForumController {

    private final ForumService forumService;

    @GetMapping("/schools/{schoolId}/forum/threads")
    public ResponseEntity<List<ForumThreadDto>> listThreads(@PathVariable UUID schoolId) {
        return ResponseEntity.ok(forumService.listThreadsForSchool(schoolId));
    }

    @PostMapping("/schools/{schoolId}/forum/threads")
    public ResponseEntity<ForumThreadDto> createThread(
        @PathVariable UUID schoolId,
        @RequestBody ForumThreadCreateDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/schools/{}/forum/threads", schoolId);
        final var created = forumService.createThread(schoolId, dto, authentication);
        return ResponseEntity.created(URI.create("/api/forum/threads/" + created.id())).body(created);
    }

    @GetMapping("/forum/threads/{threadId}")
    public ResponseEntity<ForumThreadDto> getThread(@PathVariable UUID threadId) {
        return ResponseEntity.ok(forumService.getThread(threadId));
    }

    @GetMapping("/forum/threads/{threadId}/posts")
    public ResponseEntity<List<ForumPostDto>> listPosts(@PathVariable UUID threadId) {
        return ResponseEntity.ok(forumService.listPosts(threadId));
    }

    @PostMapping("/forum/threads/{threadId}/posts")
    public ResponseEntity<ForumPostDto> createPost(
        @PathVariable UUID threadId,
        @RequestBody ForumPostCreateDto dto,
        Authentication authentication
    ) {
        log.info("POST /api/forum/threads/{}/posts", threadId);
        final var created = forumService.createPost(threadId, dto, authentication);
        return ResponseEntity.created(URI.create("/api/forum/posts/" + created.id())).body(created);
    }

    @GetMapping("/schools/{schoolId}/forum/threads/system")
    public ResponseEntity<ForumThreadDto> getSystemThread(
        @PathVariable UUID schoolId,
        @RequestParam ForumThreadType type
    ) {
        return ResponseEntity.ok(forumService.getOrCreateSystemThread(schoolId, type));
    }
}
