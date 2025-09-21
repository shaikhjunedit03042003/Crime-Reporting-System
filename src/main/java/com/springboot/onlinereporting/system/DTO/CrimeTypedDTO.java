package com.springboot.onlinereporting.system.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrimeTypedDTO {

	private long id;
	@NotEmpty(message = "Crime Typed cannot be Empty !!")
	@NotBlank(message = "Crime Typed cannot be Blank !!")
	private String crimeType;
	@NotEmpty(message = "Crime Description cannot be Empty !!")
	@NotBlank(message = "Crime Description cannot be  Blank !!")
	private String description;

}