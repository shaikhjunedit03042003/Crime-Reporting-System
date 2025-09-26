package com.springboot.onlinereporting.system.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")
public class PoliceStationEntryDTO {

	private Long id;
	@NotBlank(message = "Station cannot be empty")
	private String stationName;
	@NotBlank(message = "StationCode cannot be empty")
	private String stationCode;
	@NotBlank(message = "Email cannot be empty")
	@Email(message = "Invalid email format")
	private String emailAddress;

	@NotBlank(message = "ContactNumber cannot be empty")
	@Pattern(regexp = "^[0-9]{10}$", message = "ContactNumber must be exactly 10 digits")
	private String contactNumber;

	@NotBlank(message = "EmergencyNumber cannot be empty")
	@Pattern(regexp = "^\\d{3,10}$", message = "EmergencyNumber must be between 3 and 10 digits")
	private String emergencyNumber;

	@NotBlank(message = "faxNumber cannot be empty")
	@Pattern(regexp = "^[0-9]{3,15}$", message = "FaxNumber Must be between 3 and 15 digitss")
	private String faxNumber;

	@NotBlank(message = "AddressLine cannot be empty")
	private String addressLine1;
	@NotBlank(message = "AddressLine2 cannot be empty")
	private String addressLine2;

	@NotBlank(message = "LandMark cannot be empty")
	private String landMark;
	@NotBlank(message = "area cannot be empty")
	private String area;

	@NotBlank(message = "City cannot be empty")
	private String city;
	@NotBlank(message = "State cannot be empty")
	private String state;

	@NotBlank(message = "Pincode cannot be empty")
	@Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be exactly 6 digits")
	private String pincode;
	

}
