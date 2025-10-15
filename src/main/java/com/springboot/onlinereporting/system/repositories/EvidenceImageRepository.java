package com.springboot.onlinereporting.system.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
@Repository
public interface EvidenceImageRepository extends JpaRepository<EvidenceImageEntity, Long> {

	//@Query(value="select * from evidence_images where complaint_id = :complaintId",nativeQuery = true)
	//public List<EvidenceImageEntity> findByComplaintEvidenceImageEntity (@Param("complaintId")  Long complaintId);
    List<EvidenceImageEntity> findByComplaints_Id(Long complaintId);

}
