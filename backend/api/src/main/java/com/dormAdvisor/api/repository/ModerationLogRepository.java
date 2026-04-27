package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.ModerationLog;
import com.dormAdvisor.api.domain.entity.enums.ModEntityEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModerationLogRepository extends JpaRepository<ModerationLog, UUID> {

    List<ModerationLog> findByEntityTypeAndEntityId(ModEntityEnum entityType, UUID entityId);
}
