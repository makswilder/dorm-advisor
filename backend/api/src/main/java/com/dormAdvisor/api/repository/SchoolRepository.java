package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.School;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SchoolRepository extends JpaRepository<School, UUID> {

    Optional<School> findBySlugAndCountry(String slug, String country);

    Optional<School> findBySlug(String slug);

    List<School> findByStatus(EntityStatus status);

    List<School> findByNameContainingIgnoreCaseAndStatus(String name, EntityStatus status);
}
