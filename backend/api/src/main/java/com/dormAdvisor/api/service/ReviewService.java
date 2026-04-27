package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.ReviewCreateDto;
import com.dormAdvisor.api.domain.dto.ReviewDto;
import com.dormAdvisor.api.domain.dto.ReviewUpdateDto;
import com.dormAdvisor.api.domain.entity.Review;
import com.dormAdvisor.api.domain.entity.enums.AuthorType;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.ReviewRepository;
import com.dormAdvisor.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DormRepository dormRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewDto create(UUID dormId, ReviewCreateDto dto, String userEmail) {
        log.info("Creating review for dorm: {}", dormId);
        final var dorm = dormRepository.findById(dormId)
            .orElseThrow(() -> new EntityNotFoundException("Dorm not found: " + dormId));

        final var builder = Review.builder()
            .dorm(dorm)
            .overall(dto.overall())
            .cleanliness(dto.cleanliness())
            .locationRating(dto.locationRating())
            .noise(dto.noise())
            .value(dto.value())
            .social(dto.social())
            .roomQuality(dto.roomQuality())
            .bathroomRating(dto.bathroomRating())
            .reviewText(dto.reviewText())
            .classYear(dto.classYear())
            .yearLived(dto.yearLived());

        if (userEmail != null) {
            userRepository.findByEmailNormalized(userEmail.toLowerCase().trim()).ifPresent(user -> {
                builder.user(user);
                builder.authorType(AuthorType.USER);
                builder.isVerifiedAtPost(user.isVerifiedStudent());
            });
        }

        return ReviewDto.fromEntity(reviewRepository.save(builder.build()));
    }

    public ReviewDto getById(UUID id) {
        log.info("Fetching review: {}", id);
        return ReviewDto.fromEntity(findByIdOrThrow(id));
    }

    public List<ReviewDto> getByDorm(UUID dormId) {
        log.info("Fetching reviews for dorm: {}", dormId);
        return reviewRepository.findByDormId(dormId).stream()
            .map(ReviewDto::fromEntity)
            .toList();
    }

    @Transactional
    public ReviewDto update(UUID id, ReviewUpdateDto dto) {
        log.info("Updating review: {}", id);
        final var review = findByIdOrThrow(id);
        review.setOverall(dto.overall());
        review.setCleanliness(dto.cleanliness());
        review.setLocationRating(dto.locationRating());
        review.setNoise(dto.noise());
        review.setValue(dto.value());
        review.setSocial(dto.social());
        review.setRoomQuality(dto.roomQuality());
        review.setBathroomRating(dto.bathroomRating());
        review.setReviewText(dto.reviewText());
        if (dto.status() != null) review.setStatus(dto.status());
        return ReviewDto.fromEntity(reviewRepository.save(review));
    }

    @Transactional
    public void delete(UUID id) {
        log.info("Deleting review: {}", id);
        reviewRepository.delete(findByIdOrThrow(id));
    }

    private Review findByIdOrThrow(UUID id) {
        return reviewRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Review not found: " + id));
    }
}
