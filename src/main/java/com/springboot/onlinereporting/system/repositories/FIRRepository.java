package com.springboot.onlinereporting.system.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.FIREntity;

@Repository
public interface FIRRepository extends JpaRepository<FIREntity, Long> {

	Long countByFirNumberStartingWith(String prefix);
	Optional<FIREntity>	findByComplaintId(Long id);
	Optional<FIREntity> findByFirNumberAndComplaintId(String firNumber, Long complaintId);

}
