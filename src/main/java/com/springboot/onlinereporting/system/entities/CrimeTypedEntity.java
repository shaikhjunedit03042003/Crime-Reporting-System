package com.springboot.onlinereporting.system.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter

@Entity
@Table(name = "CrimeTyped")
public class CrimeTypedEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "crimetyped_id")
	private long id;
	private String crimeType;
	@Column(length = 1000) 
	private String description;

}
