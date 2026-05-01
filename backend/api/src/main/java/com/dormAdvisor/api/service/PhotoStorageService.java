package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.entity.Photo;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.domain.entity.enums.ContentStatus;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.PhotoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class PhotoStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final int THUMB_WIDTH = 600;
    private static final int THUMB_HEIGHT = 400;
    private static final double THUMB_QUALITY = 0.70;

    private final PhotoRepository photoRepository;
    private final DormRepository dormRepository;
    private final Tika tika = new Tika();

    @Value("${app.photo.upload-dir:./uploads/photos}")
    private String uploadDir;

    @Value("${app.photo.max-width:1920}")
    private int maxWidth;

    @Value("${app.photo.max-height:1080}")
    private int maxHeight;

    @Value("${app.photo.quality:0.80}")
    private double quality;

    @Transactional
    public Photo store(UUID dormId, MultipartFile file, String caption, UUID userId, UUID reviewId) throws IOException {
        if (!dormRepository.existsById(dormId)) {
            throw new EntityNotFoundException("Dorm not found: " + dormId);
        }
        byte[] bytes = file.getBytes();
        String detectedType = tika.detect(bytes);
        if (!ALLOWED_TYPES.contains(detectedType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, and WebP images are allowed. Detected: " + detectedType);
        }

        Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path thumbDir = baseDir.resolve("thumbs");
        Files.createDirectories(baseDir);
        Files.createDirectories(thumbDir);
        String storageKey = UUID.randomUUID() + ".jpg";
        Path target = baseDir.resolve(storageKey);
        Path thumbTarget = thumbDir.resolve(storageKey);
        Thumbnails.of(new ByteArrayInputStream(bytes))
            .size(maxWidth, maxHeight)
            .keepAspectRatio(true).outputFormat("jpg")
            .outputQuality(quality).toFile(target.toFile());

        Thumbnails.of(new ByteArrayInputStream(bytes))
            .size(THUMB_WIDTH, THUMB_HEIGHT)
            .keepAspectRatio(true).outputFormat("jpg")
            .outputQuality(THUMB_QUALITY).toFile(thumbTarget.toFile());
        BufferedImage compressed = ImageIO.read(target.toFile());
        int width = compressed != null ? compressed.getWidth() : 0;
        int height = compressed != null ? compressed.getHeight() : 0;

        log.info("Stored photo for dorm {}: key={} ({}x{}, {} bytes → {} bytes)",
            dormId, storageKey, width, height, bytes.length, Files.size(target));

        Photo photo = Photo.builder()
            .dormId(dormId).userId(userId).reviewId(reviewId)
            .authorType(userId != null ? AuthorType.USER : AuthorType.GUEST)
            .storageKey(storageKey)
            .width(width).height(height)
            .caption(caption).status(ContentStatus.VISIBLE).build();
        return photoRepository.save(photo);
    }

    @Transactional(readOnly = true)
    public List<Photo> getVisibleByDorm(UUID dormId) {
        return photoRepository.findByDormIdAndStatusOrderByCreatedAtDesc(dormId, ContentStatus.VISIBLE);
    }

    public Path resolve(String storageKey) {
        Path base = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path resolved = base.resolve(storageKey).normalize();
        if (!resolved.startsWith(base)) {
            throw new IllegalArgumentException("Invalid storage key");
        }
        return resolved;
    }

    public Path resolveThumb(String storageKey) {
        Path base = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path resolved = base.resolve("thumbs").resolve(storageKey).normalize();
        if (!resolved.startsWith(base)) {
            throw new IllegalArgumentException("Invalid storage key");
        }
        return resolved;
    }
}
