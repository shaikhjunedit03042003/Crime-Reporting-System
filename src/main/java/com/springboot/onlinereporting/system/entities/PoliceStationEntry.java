package com.springboot.onlinereporting.system.entities;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "policestationentry")
@Builder(builderMethodName = "of")
public class PoliceStationEntry {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "police_station_id")
	private Long id;

	@Column(unique = true)
	private String stationName;

	@Column(unique = true)
	private String stationCode;

	@Column(unique = true)
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
	@OneToMany(mappedBy = "policeStation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@ToString.Exclude
	private List<PoliceOfficerEntity> officers;
}