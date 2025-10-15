package com.springboot.onlinereporting.system.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.BO.FIRBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.DTO.FIRDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.FIREntity;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.mapper.FIRMapper;
import com.springboot.onlinereporting.system.repositories.ComplaintsRepository;
import com.springboot.onlinereporting.system.repositories.FIRRepository;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.repositories.UserRepository;

import jakarta.validation.Valid;

@Service
public class FIRService {

	@Autowired
	private PoliceOfficerRepository policeOfficerRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ComplaintsRepository complaintsRepository;
	
	
	@Autowired
	private FIRMapper firMapper;

	@Autowired
	private FIRRepository firRepository;

	public FIREntity createFIR(FIRDTO firDTO, Long policeOfficerId, Long userId, Long complaintId) {
		Optional<PoliceOfficerEntity> policeOfficer = policeOfficerRepository.findById(policeOfficerId);
		Optional<UserEntity> user = userRepository.findById(userId);
		Optional<ComplaintEntity> complaint = complaintsRepository.findById(complaintId);
		if (policeOfficer.isEmpty() || user.isEmpty() || complaint.isEmpty()) {
			throw new RuntimeException("Police Officer, User, or Complaint not found");
		}

		FIREntity firEntity = null;
		try {
			firEntity = FIRMapper.toEntity(firDTO);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} // Assuming a mapper is used
		firEntity.setFirNumber(generateFIRNumber());
		firEntity.setCreatedAt(firDTO.getCreatedAt() != null ? firDTO.getCreatedAt() : LocalDateTime.now());
		firEntity.setUpdatedAt(LocalDateTime.now());
		firEntity.setUser(user.get());
		firEntity.setPoliceOfficer(policeOfficer.get());
		firEntity.setComplaint(complaint.get());

		return firRepository.save(firEntity);
	}

	// Method to generate a unique FIR number
	private String generateFIRNumber() {
		String prefix = "FIR/" + LocalDateTime.now().getYear() + "/";
		Long count = firRepository.countByFirNumberStartingWith(prefix);
		return prefix + String.format("%04d", count + 1);
	}

	public FIRDTO findById(Long firId) {

		FIREntity firEntity = firRepository.findById(firId).get();

		if (firEntity != null)
			return firMapper.toDTO(firEntity);

		return null;
	}
}