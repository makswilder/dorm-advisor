package com.dormAdvisor.api.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dorm_aggregates")
@Immutable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DormAggregate {

    @Id
    @Column(name = "dorm_id")
    private UUID dormId;

    private double avgOverall;
    private int reviewCount;

    private Double avgCleanliness;
    private int cleanlinessCount;

    private Double avgLocation;
    private int locationCount;

    private Double avgNoise;
    private int noiseCount;

    private Double avgValue;
    private int valueCount;

    private Double avgSocial;
    private int socialCount;

    private Double avgRoomQuality;
    private int roomQualityCount;

    private Double avgBathroom;
    private int bathroomCount;

    private LocalDateTime lastUpdatedAt;
}
