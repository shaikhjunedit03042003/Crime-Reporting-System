package com.springboot.onlinereporting.system.BO;

import java.time.LocalDateTime;

import com.springboot.onlinereporting.system.entities.PoliceStationEntry;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")

public class PoliceOfficerBO {

	private Long id;

	private String name;

	private String badgeNumber;

	private String email;

	private String contactNumber;
	private String policeStationselect;

	private PoliceStationEntry policeStation;
	private String rank; // e.g., Inspector, Constable
	
	private byte[] images;
	
	private String filename;
	private String contentType;
	
}
