package com.springboot.onlinereporting.system.BO;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")
public class FIRBO {

    private Long id;
    private String firNumber;
    private String title;
    private String description;
    private String location;
    private String crimeType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String caseOfficerNotes;
    private Boolean isUnderInvestigation;
    private Long userId; // ID of the associated UserEntity
    private Long policeOfficerId; // ID of the associated PoliceOfficerEntity
    private Long complaintId; // ID of the associated ComplaintEntity



    // Optional: Add business logic methods if needed
    public boolean isActive() {
        return "ACTIVE".equalsIgnoreCase(status);
    }

    public boolean isUnderInvestigationForDays(int days) {
        if (createdAt == null) return false;
        return LocalDateTime.now().minusDays(days).isBefore(createdAt);
    }
}