package com.springboot.onlinereporting.system.entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fir")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "of")
public class FIREntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fir_number", nullable = false, unique = true)
    private String firNumber;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "crime_type", nullable = false)
    private String crimeType;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", columnDefinition = "DATETIME", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DATETIME", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "case_officer_notes", columnDefinition = "TEXT")
    private String caseOfficerNotes;

    @Column(name = "is_under_investigation")
    private Boolean isUnderInvestigation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_officer_id", nullable = false)
    @ToString.Exclude
    private PoliceOfficerEntity policeOfficer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = true, unique = true)
    @ToString.Exclude
    private ComplaintEntity complaint;
}