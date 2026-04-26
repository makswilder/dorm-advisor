package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.Dorm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DormRepository extends JpaRepository<Dorm, UUID> {

    List<Dorm> findBySchoolId(UUID schoolId);

    Optional<Dorm> findBySchoolIdAndSlug(UUID schoolId, String slug);
}
