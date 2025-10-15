package com.springboot.onlinereporting.system.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.FIREntity;

@Repository
public interface ComplaintsRepository extends JpaRepository<ComplaintEntity, Long> {

	@Query("SELECT c FROM ComplaintEntity c where c.user.id =:user_id and  c.userEmail =:user_emaild")
	public List<ComplaintEntity> getAllComplaints(@Param("user_id") Long id, @Param("user_emaild") String emailid);

	@Query("SELECT c FROM ComplaintEntity c where c.id =:complaint_id and c.user.id =:user_id and  c.userEmail =:user_emaild")
	public ComplaintEntity getComplaint(@Param("complaint_id") Long complaintId, @Param("user_id") Long id,
			@Param("user_emaild") String emailid);
	
	public Optional<ComplaintEntity> findById(Long id);
	

	@Query("select c from ComplaintEntity c where c.policeStation = :policecode")
	List<ComplaintEntity> getAllComplaintsByPoliceStationCode(@Param("policecode") String policecode);
	
	
	@Query(value = "SELECT * FROM complaints WHERE officer_id = :policeId", nativeQuery = true)
	List<ComplaintEntity> findByOfficerId(@Param("policeId") Long policeId);
	
	
	
	@Query(value = "SELECT * FROM fir WHERE police_officer_id = :policeId", nativeQuery = true)
	List<FIREntity> findFIRByOfficerId(@Param("policeId") Long policeId);


	public List<ComplaintEntity> findAll();

}
