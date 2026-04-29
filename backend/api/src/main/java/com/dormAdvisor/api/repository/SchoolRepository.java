package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.School;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SchoolRepository extends JpaRepository<School, UUID> {

    Optional<School> findBySlugAndCountry(String slug, String country);

    Optional<School> findBySlug(String slug);

    List<School> findByStatus(EntityStatus status);

    @Query(value = "SELECT * FROM schools WHERE name ILIKE CONCAT('%', :name, '%') AND status = CAST(:status AS entity_status) AND removed_at IS NULL", nativeQuery = true)
    List<School> findByNameContainingIgnoreCaseAndStatus(@Param("name") String name, @Param("status") String status);
}
