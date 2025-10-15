package com.springboot.onlinereporting.system.mapper;

import org.springframework.stereotype.Component;
import com.springboot.onlinereporting.system.BO.FIRBO;
import com.springboot.onlinereporting.system.DTO.FIRDTO;
import com.springboot.onlinereporting.system.entities.FIREntity;

@Component
public class FIRMapper {

    public FIRDTO toDTO(FIREntity entity) {
        return new FIRDTO(
            entity.getId(),
            entity.getFirNumber(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getLocation(),
            entity.getCrimeType(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getCaseOfficerNotes(),
            entity.getIsUnderInvestigation(),
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.getPoliceOfficer() != null ? entity.getPoliceOfficer().getId() : null,
            entity.getComplaint() != null ? entity.getComplaint().getId() : null
        );
    }

    public FIRBO toBO(FIREntity entity) {
        return new FIRBO(
            entity.getId(),
            entity.getFirNumber(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getLocation(),
            entity.getCrimeType(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.getCaseOfficerNotes(),
            entity.getIsUnderInvestigation(),
            entity.getUser() != null ? entity.getUser().getId() : null,
            entity.getPoliceOfficer() != null ? entity.getPoliceOfficer().getId() : null,
            entity.getComplaint() != null ? entity.getComplaint().getId() : null
        );
    }

    public static FIREntity toEntity(FIRDTO dto) {
        return FIREntity.of()
            .id(dto.getId())
            .firNumber(dto.getFirNumber())
            .title(dto.getTitle())
            .description(dto.getDescription())
            .location(dto.getLocation())
            .crimeType(dto.getCrimeType())
            .status(dto.getStatus())
            .createdAt(dto.getCreatedAt())
            .updatedAt(dto.getUpdatedAt())
            .caseOfficerNotes(dto.getCaseOfficerNotes())
            .isUnderInvestigation(dto.isUnderInvestigation())
            .build();
    }
}