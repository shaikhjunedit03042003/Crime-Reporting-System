package com.springboot.onlinereporting.system.BO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")

public class ComplaintBO {

	private Long id;
	private UserEntity user;
	private Long userId;
	private String username;
	private String title;
	private String description;
	private String status;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String crimeType;
	private String location;
	private String userEmail;
	private String liveLocationLink;
	private String policeStation;

	private List<MultipartFile> evidenceImages;
	// For processing uploaded files}
}
