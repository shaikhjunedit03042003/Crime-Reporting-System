package com.springboot.onlinereporting.system.DTO;

import org.apache.commons.lang3.builder.ToStringExclude;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")
@ToString
public class UserDTO {
	private Long id;

	@NotBlank(message = "Username cannot be empty")
	@Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
	private String username;

	@NotBlank(message = "Email cannot be empty")
	@Email(message = "Invalid email format")
	private String emailid;

	@NotBlank(message = "Password cannot be empty")
	@Size(min = 6, message = "Password must be at least 6 characters")
	private String password;

	@NotBlank(message = "Role is Required")
	private String role;

	private String message;

	@NotNull(message = "Image is required")
	private MultipartFile image; // ✅ This is only for web input

	private boolean agreement;

	private String secretKey;
	
	
    @ToStringExclude

    private String filename;
    @ToStringExclude

    private String contentType;
}
