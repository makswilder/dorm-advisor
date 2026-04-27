package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.SchoolDomain;
import com.dormAdvisor.api.domain.entity.enums.EntityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface SchoolDomainRepository extends JpaRepository<SchoolDomain, UUID> {

    @Query("SELECT sd FROM SchoolDomain sd JOIN sd.school s WHERE sd.domain = :domain AND s.status = :status")
    Optional<SchoolDomain> findByDomainAndSchoolStatus(
        @Param("domain") String domain,
        @Param("status") EntityStatus status
    );
}