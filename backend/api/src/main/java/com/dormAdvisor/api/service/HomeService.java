package com.dormAdvisor.api.service;

import com.dormAdvisor.api.domain.dto.DormSummaryDto;
import com.dormAdvisor.api.domain.dto.HomeDto;
import com.dormAdvisor.api.domain.dto.SchoolSummaryDto;
import com.dormAdvisor.api.repository.DormRepository;
import com.dormAdvisor.api.repository.SchoolRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class HomeService {

    private final SchoolRepository schoolRepository;
    private final DormRepository dormRepository;
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public HomeDto getHomepageData() {
        log.info("Fetching homepage data");
        return new HomeDto(
            fetchTopSchools(),
            fetchTopDormsByReviews(),
            fetchHighestRatedDorms()
        );
    }

    @SuppressWarnings("unchecked")
    private List<SchoolSummaryDto> fetchTopSchools() {
        final var rows = entityManager.createNativeQuery("""
            SELECT s.id, s.name, s.slug, s.city, s.state,
                   COALESCE(SUM(da.review_count), 0)::int AS total_reviews
            FROM schools s
            JOIN dorms d ON d.school_id = s.id
            JOIN dorm_aggregates da ON da.dorm_id = d.id
            WHERE s.status = 'ACTIVE' AND d.status = 'ACTIVE'
            GROUP BY s.id, s.name, s.slug, s.city, s.state
            ORDER BY total_reviews DESC
            LIMIT 5
            """).getResultList();
        return rows.stream().map(r -> {
            final Object[] cols = (Object[]) r;
            return new SchoolSummaryDto(
                java.util.UUID.fromString(cols[0].toString()),
                (String) cols[1],
                (String) cols[2],
                (String) cols[3],
                (String) cols[4],
                ((Number) cols[5]).intValue()
            );
        }).toList();
    }

    @SuppressWarnings("unchecked")
    private List<DormSummaryDto> fetchTopDormsByReviews() {
        final var rows = entityManager.createNativeQuery("""
            SELECT da.dorm_id, d.name, d.slug,
                   s.id, s.name, s.slug,
                   da.avg_overall, da.review_count
            FROM dorm_aggregates da
            JOIN dorms d ON d.id = da.dorm_id
            JOIN schools s ON s.id = d.school_id
            WHERE d.status = 'ACTIVE' AND s.status = 'ACTIVE'
            ORDER BY da.review_count DESC
            LIMIT 5
            """).getResultList();
        return toDormSummaryList(rows);
    }

    @SuppressWarnings("unchecked")
    private List<DormSummaryDto> fetchHighestRatedDorms() {
        final var rows = entityManager.createNativeQuery("""
            SELECT da.dorm_id, d.name, d.slug,
                   s.id, s.name, s.slug,
                   da.avg_overall, da.review_count
            FROM dorm_aggregates da
            JOIN dorms d ON d.id = da.dorm_id
            JOIN schools s ON s.id = d.school_id
            WHERE d.status = 'ACTIVE' AND s.status = 'ACTIVE' AND da.review_count >= 3
            ORDER BY da.avg_overall DESC, da.review_count DESC
            LIMIT 5
            """).getResultList();
        return toDormSummaryList(rows);
    }

    private List<DormSummaryDto> toDormSummaryList(List<?> rows) {
        return rows.stream().map(r -> {
            final Object[] cols = (Object[]) r;
            return new DormSummaryDto(
                java.util.UUID.fromString(cols[0].toString()),
                (String) cols[1],
                (String) cols[2],
                java.util.UUID.fromString(cols[3].toString()),
                (String) cols[4],
                (String) cols[5],
                ((Number) cols[6]).doubleValue(),
                ((Number) cols[7]).intValue()
            );
        }).toList();
    }
}