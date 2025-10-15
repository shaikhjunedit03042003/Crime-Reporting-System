package com.springboot.onlinereporting.system.BO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrimeTypedBO {

	private long id;
	private String crimeType;
	private String description;

}
