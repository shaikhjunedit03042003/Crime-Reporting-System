package com.springboot.onlinereporting.system.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PoliceLoginDTO {

	@Email(message = "Email Id is Required!!!")
	private String email;
	@NotBlank(message = "ContactNumber cannot be empty")
	@Pattern(regexp = "^[0-9]{10}$", message = "ContactNumber must be exactly 10 digits")
	private String contactNumber;

}
