package com.springboot.onlinereporting.system.DTO;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.entities.PoliceStationEntry;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")


public class PoliceOfficerDTO {

	private Long id;

	@NotEmpty(message = "Name cannot be Empty")
	private String name;

	@NotEmpty(message = "BadgeNumber cannot be Empty")
	private String badgeNumber;

	@Email(message = "Invalid Email !!")
	private String email;

	@NotBlank(message = "ContactNumber cannot be empty")
	@Pattern(regexp = "^[0-9]{10}$", message = "ContactNumber must be exactly 10 digits")
	private String contactNumber;

	@NotNull(message="police Station must be select")
	
	private String policeStationselect;

	
	private PoliceStationEntry policeStation;
	@NotEmpty(message = "Rank cannot be Empty")
	private String rank;

	@NotNull(message = "Police Image Must be Select")
	private MultipartFile policeImages;
	
	private String filename;
	private String contentType;

}
