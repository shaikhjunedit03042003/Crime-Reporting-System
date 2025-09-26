package com.springboot.onlinereporting.system.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.PoliceStationEntry;

@Repository
public interface PoliceOfficerRepository extends JpaRepository<PoliceOfficerEntity, Long> {

	public PoliceOfficerEntity findByBadgeNumberAndPoliceStationselect(String badgeNumber, String policeStationselect);

	public PoliceOfficerEntity findByEmailAndContactNumber(String email, String contactNo);
	public List<PoliceOfficerEntity> findAll();

	public boolean existsByBadgeNumber(String bagdeNumber);

	public PoliceOfficerEntity findByBadgeNumber(String bagdeNumber);


}
