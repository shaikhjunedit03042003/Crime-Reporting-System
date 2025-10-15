package com.springboot.onlinereporting.system.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "complaints")
public class ComplaintEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "complaint_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude  
    private UserEntity user;

    @Transient
    private Long userId;

    private String username;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", columnDefinition = "DATETIME", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updtated_at", columnDefinition = "DATETIME", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "crime_type")
    private String crimeType;

    @Column(name = "location")
    private String location;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "live_location_link")
    private String liveLocationLink;

    private String policeStation;

    @OneToMany(mappedBy = "complaints", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude  
    private List<EvidenceImageEntity> evidenceImages = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    @ToString.Exclude  
    private PoliceOfficerEntity assignedOfficer;
    
    @OneToOne(mappedBy = "complaint", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private FIREntity fir;

    @Override
    public String toString() {
        return "ComplaintEntity{" +
                "id=" + id +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", crimeType='" + crimeType + '\'' +
                ", location='" + location + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", liveLocationLink='" + liveLocationLink + '\'' +
                ", policeStation='" + policeStation + '\'' +
                '}';
    }
}