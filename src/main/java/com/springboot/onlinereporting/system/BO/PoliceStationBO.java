package com.springboot.onlinereporting.system.BO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")
public class PoliceStationBO {

	private Long id;

	private String stationName;
	private String stationCode;
	private String emailAddress;
	private String contactNumber;
	private String emergencyNumber;
	private String faxNumber;
	private String addressLine1;
	private String addressLine2;

	private String landMark;
	private String area;

	private String city;
	private String state;

	private String pincode;

	
}
