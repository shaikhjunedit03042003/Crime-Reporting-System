package com.springboot.onlinereporting.system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;

@Repository
public interface PoliceLoginRepository extends JpaRepository<PoliceOfficerEntity, Long> {

	
	public PoliceOfficerEntity findByEmailAndContactNumber(String email, String contactNo);

}
