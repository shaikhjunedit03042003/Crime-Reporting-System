package com.springboot.onlinereporting.system.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserDTO {
	@NotBlank(message = "Email cannot be empty")
	@Email(message = "Invalid email format")
	private String emailid;
	@NotBlank(message = "Password cannot be empty")
	@Size(min = 6, message = "Password must be at least 6 characters")
	private String password;
}
