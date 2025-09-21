package com.springboot.onlinereporting.system.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")


@Entity
@Table(name = "police_officers")
public class PoliceOfficerEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(unique = true, nullable = false)
	private String badgeNumber;

	@Column(unique = true)
	private String email;

	@Column(unique = true)
	private String contactNumber;

	private String policeStationselect;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "police_station_id")
	private PoliceStationEntry policeStation;

	@Column(name="officer_rank")
	private String rank; // e.g., Inspector, Constable
	
	@Column(name="police_images",columnDefinition = "LONGBLOB")
	@Lob()
	private byte[] imgaes;	
	private String filename;
	private String contentType;
}