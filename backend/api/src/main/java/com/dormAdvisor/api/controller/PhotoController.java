package com.dormAdvisor.api.controller;

import com.dormAdvisor.api.domain.dto.PhotoDto;
import com.dormAdvisor.api.domain.entity.Photo;
import com.dormAdvisor.api.repository.PhotoRepository;
import com.dormAdvisor.api.repository.UserRepository;
import com.dormAdvisor.api.service.PhotoStorageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class PhotoController {

    private final PhotoStorageService photoStorageService;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;

    @PostMapping("/dorms/{dormId}/photos")
    public ResponseEntity<PhotoDto> upload(
        @PathVariable UUID dormId,
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "caption", required = false) String caption,
        @RequestParam(value = "reviewId", required = false) UUID reviewId,
        Authentication authentication
    ) throws IOException {
        log.info("POST /api/dorms/{}/photos — filename: {}, size: {} bytes", dormId, file.getOriginalFilename(), file.getSize());
        UUID userId = resolveUserId(authentication);
        Photo photo = photoStorageService.store(dormId, file, caption, userId, reviewId);
        PhotoDto dto = PhotoDto.fromEntity(photo);
        return ResponseEntity.created(URI.create("/api/photos/" + photo.getId())).body(dto);
    }

    @GetMapping("/dorms/{dormId}/photos")
    public ResponseEntity<List<PhotoDto>> gallery(@PathVariable UUID dormId) {
        List<PhotoDto> photos = photoStorageService.getVisibleByDorm(dormId).stream()
            .map(PhotoDto::fromEntity)
            .toList();
        return ResponseEntity.ok(photos);
    }

    @GetMapping("/photos/{id}")
    public ResponseEntity<Resource> serve(@PathVariable UUID id) {
        Photo photo = photoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Photo not found: " + id));
        Path filePath = photoStorageService.resolve(photo.getStorageKey());
        Resource resource = new FileSystemResource(filePath);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
    }

    @GetMapping("/photos/{id}/thumb")
    public ResponseEntity<Resource> serveThumb(@PathVariable UUID id) {
        Photo photo = photoRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Photo not found: " + id));
        Path thumbPath = photoStorageService.resolveThumb(photo.getStorageKey());
        Resource resource = new FileSystemResource(thumbPath);
        if (!resource.exists()) {
            return serve(id);
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
    }

    private UUID resolveUserId(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmailNormalized(authentication.getName())
            .map(u -> u.getId())
            .orElse(null);
    }
}
