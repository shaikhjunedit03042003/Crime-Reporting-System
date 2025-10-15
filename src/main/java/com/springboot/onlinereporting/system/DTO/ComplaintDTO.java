package com.springboot.onlinereporting.system.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString.Exclude;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")

public class ComplaintDTO {

	private Long id;

	@NotNull(message = "User cannot be Null")
	private Long userId;
	
    private UserEntity user;


	private String username;

	@NotEmpty(message = "Title cannot be Empty")
	private String title;

	@NotEmpty(message = "Description connot be Empty ")
	private String description;

	private String status;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm")
	@NotNull(message = "Created At Date is not Null")
	private LocalDateTime createdAt;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm")
	@NotNull(message = "Updated At Date is not Null")
	private LocalDateTime updatedAt;

	private String crimeType;
	@NotEmpty(message = "Location cannot bt EMpty")
	private String location;

	@NotEmpty(message = "Email cannot be Empty")
	@Email(message = "Invalid Email !!")
	private String userEmail;
	@NotEmpty(message = "Live Location Link cannot be Empty")
	private String liveLocationLink;

	private String policeStation;

	private List<MultipartFile> evidenceImages=new ArrayList<>(); 
	@Exclude
	private PoliceOfficerEntity assignedOfficer;

}
