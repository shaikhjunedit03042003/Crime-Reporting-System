package com.springboot.onlinereporting.system.DTO;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")
public class FIRDTO {

    private Long id;

    @NotBlank(message = "FIR number cannot be blank")
    @Size(max = 50, message = "FIR number must not exceed 50 characters")
    private String firNumber;

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "Location cannot be blank")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @NotBlank(message = "Crime type cannot be blank")
    @Size(max = 100, message = "Crime type must not exceed 100 characters")
    private String crimeType;

    @NotBlank(message = "Status cannot be blank")
    private String status;

    @NotNull(message = "CreatedAt cannot be null")
    private LocalDateTime createdAt;

    @NotNull(message = "UpdatedAt cannot be null")
    private LocalDateTime updatedAt;

    @Size(max = 2000, message = "Case officer notes must not exceed 2000 characters")
    private String caseOfficerNotes;

    @NotNull(message = "Investigation status must be specified (true/false)")
    private Boolean isUnderInvestigation;

    @NotNull(message = "User ID is required")
    private Long userId; 

    @NotNull(message = "Police officer ID is required")
    private Long policeOfficerId; 

    @NotNull(message = "Complaint ID is required")
    private Long complaintId; 

    public Boolean isUnderInvestigation() {
        return Boolean.TRUE.equals(this.isUnderInvestigation);
    }

    public void setIsUnderInvestigation(Boolean isUnderInvestigation) {
        this.isUnderInvestigation = isUnderInvestigation;
    }
}
