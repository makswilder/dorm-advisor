package com.dormAdvisor.api.repository;

import com.dormAdvisor.api.domain.entity.DormAggregate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface DormAggregateRepository extends JpaRepository<DormAggregate, UUID> {

    @Query(value = """
        SELECT da.* FROM dorm_aggregates da
        JOIN dorms d ON d.id = da.dorm_id
        WHERE d.school_id = :schoolId AND da.review_count >= :minReviews
        ORDER BY da.avg_overall DESC, da.review_count DESC
        """, nativeQuery = true)
    List<DormAggregate> findRankedBySchool(@Param("schoolId") UUID schoolId, @Param("minReviews") int minReviews);
}
