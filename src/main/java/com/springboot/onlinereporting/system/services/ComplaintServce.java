package com.springboot.onlinereporting.system.services;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.BO.ComplaintBO;
import com.springboot.onlinereporting.system.BO.FIRBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
import com.springboot.onlinereporting.system.entities.FIREntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.helper.ByteArraytoMultipartFile;
import com.springboot.onlinereporting.system.repositories.ComplaintsRepository;
import com.springboot.onlinereporting.system.repositories.EvidenceImageRepository;

@Service
public class ComplaintServce {

	@Autowired
	private ComplaintsRepository complaintsRepository;

	@Autowired
	private EvidenceImageRepository evidenceImageRepository;

	public ComplaintEntity saveComplaints(ComplaintEntity complaintEntity) {
		return complaintsRepository.save(complaintEntity);
	}

	@Transactional(readOnly = false)
	public ComplaintDTO saveComplaint(ComplaintBO complaintBO) throws Exception {
		try {

			ComplaintEntity complaintEntity = convertBoToEntity(complaintBO);

			// Attach images to complaintEntity
			if (complaintEntity.getEvidenceImages() != null) {
				for (EvidenceImageEntity img : complaintEntity.getEvidenceImages()) {
					img.setComplaints(complaintEntity);
				}
			}

			// Save complaint with images
			ComplaintEntity saved = complaintsRepository.save(complaintEntity);

			return convertEntityToDTO(saved);
		} catch (Exception e) {
			throw new RuntimeException("Failed to save complaint: " + e.getMessage(), e);
		}
	}

	public ComplaintEntity updateComplaints(ComplaintEntity complaintEntity) {
		return complaintsRepository.save(complaintEntity);

	}

	public List<ComplaintDTO> getAllComplaints(Long userId, String emailid) {
		List<ComplaintEntity> complaintEntities = complaintsRepository.getAllComplaints(userId, emailid);

		return complaintEntities.stream()
				.map(c -> ComplaintDTO.of().id(c.getId()).userId(c.getUser().getId()).title(c.getTitle())
						.username(c.getUser().getUsername()).description(c.getDescription()).status(c.getStatus())
						.createdAt(c.getCreatedAt()).updatedAt(c.getUpdatedAt()).crimeType(c.getCrimeType())
						.location(c.getLocation()).liveLocationLink(c.getLiveLocationLink()).userEmail(c.getUserEmail())
						.build())
				.collect(Collectors.toList());

	}
	/*
	 * public ComplaintEntity getComplaint(Long complaitId, Long userId, String
	 * emailid) {
	 * 
	 * ComplaintEntity complaintEntity =
	 * complaintsRepository.getComplaint(complaitId, userId, emailid);
	 * 
	 * return complaintEntity; }
	 */

	public ComplaintDTO getComplaint(Long complaitId, Long userId, String emailid) {

		ComplaintEntity complaintEntity = complaintsRepository.getComplaint(complaitId, userId, emailid);

		if (complaintEntity != null) {
			return convertEntityToDTO(complaintEntity);

		}
		return null;
	}

	public ComplaintDTO findComplaintById(Long id) {

		ComplaintEntity complaintEntity = complaintsRepository.findById(id).orElse(null);
		if (complaintEntity != null) {
			return ComplaintDTO.of().createdAt(complaintEntity.getCreatedAt()).crimeType(complaintEntity.getCrimeType())
					.description(complaintEntity.getDescription())
					// .evidenceImages(complaintEntity.getEvidenceImages())
					.id(complaintEntity.getId()).liveLocationLink(complaintEntity.getLiveLocationLink())
					.location(complaintEntity.getLocation()).policeStation(complaintEntity.getPoliceStation())
					.status(complaintEntity.getStatus()).title(complaintEntity.getTitle())
					.updatedAt(complaintEntity.getUpdatedAt()).userEmail(complaintEntity.getUserEmail())
					.userId(complaintEntity.getUser().getId()).username(complaintEntity.getUsername())

					.build();
		}

		return null;
	}

	public boolean deleteComplaints(Long complaintId) {
		if (complaintsRepository.existsById(complaintId)) {
			complaintsRepository.deleteById(complaintId);
			return true;
		}
		return false;
	}

	private String calculateHash(byte[] data) throws NoSuchAlgorithmException {
		MessageDigest digest = MessageDigest.getInstance("SHA-256");
		byte[] hash = digest.digest(data);
		return Base64.getEncoder().encodeToString(hash);
	}

	// Fetch complaints by police station code
	public List<ComplaintBO> getComplaintsByPoliceOfficerId(Long policeId) {

		List<ComplaintEntity> allcomplains = complaintsRepository.findByOfficerId(policeId);
		System.out.println("Police statiion Entity==" + allcomplains);
		if (allcomplains != null && !allcomplains.isEmpty()) {

			System.out.println();
			return allcomplains.stream().map(complaint -> ComplaintBO.of().createdAt(complaint.getCreatedAt())
					.crimeType(complaint.getCrimeType()).description(complaint.getDescription())
					// .evidenceImages(complaint.getEvidenceImages())
					.id(complaint.getId()).liveLocationLink(complaint.getLiveLocationLink())
					.location(complaint.getLocation()).policeStation(complaint.getPoliceStation())
					.status(complaint.getStatus()).title(complaint.getTitle()).updatedAt(complaint.getUpdatedAt())
					.user(complaint.getUser()).userEmail(complaint.getUserEmail()).userId(complaint.getUser().getId())
					.username(complaint.getUsername())

					.build()

			).collect(Collectors.toList());

		}

		return Collections.emptyList();
	}

	public List<ComplaintBO> getAllComplaints() {
		List<ComplaintEntity> allComplaints = complaintsRepository.findAll();
		if (allComplaints != null) {

			return allComplaints.stream()
					.map(complaints -> ComplaintBO.of().createdAt(complaints.getCreatedAt())
							.crimeType(complaints.getCrimeType()).description(complaints.getDescription())
							// .evidenceImages(complaints.getEvidenceImages())
							.id(complaints.getId()).liveLocationLink(complaints.getLiveLocationLink())
							.location(complaints.getLocation()).policeStation(complaints.getPoliceStation())
							.status(complaints.getStatus()).title(complaints.getTitle())
							.updatedAt(complaints.getUpdatedAt()).user(complaints.getUser())
							.userEmail(complaints.getUserEmail()).username(complaints.getUser().getUsername())
							.userId(complaints.getUser().getId()).build())
					.collect(Collectors.toList());
		}

		return null;
	}

	private ComplaintDTO convertEntityToDTO(ComplaintEntity complaintEntity) {
		ComplaintDTO complaintDTO = new ComplaintDTO();
		complaintDTO.setId(complaintEntity.getId());
		complaintDTO.setUserId(complaintEntity.getUserId());
		complaintDTO.setUsername(complaintEntity.getUsername());
		complaintDTO.setTitle(complaintEntity.getTitle());
		complaintDTO.setDescription(complaintEntity.getDescription());
		complaintDTO.setStatus(complaintEntity.getStatus());
		complaintDTO.setCreatedAt(complaintEntity.getCreatedAt());
		complaintDTO.setUpdatedAt(complaintEntity.getUpdatedAt());
		complaintDTO.setCrimeType(complaintEntity.getCrimeType());
		complaintDTO.setLocation(complaintEntity.getLocation());
		complaintDTO.setUserEmail(complaintEntity.getUserEmail());
		complaintDTO.setLiveLocationLink(complaintEntity.getLiveLocationLink());
		complaintDTO.setPoliceStation(complaintEntity.getPoliceStation());

		/*
		 * private byte[] content; private String name; private String originalFileName;
		 * private String contentType;
		 */
		List<MultipartFile> files = new ArrayList<>();
		for (EvidenceImageEntity ev : complaintEntity.getEvidenceImages()) {

			files.add(new ByteArraytoMultipartFile(ev.getContent(), ev.getFileName(), ev.getFileName(),
					ev.getContentType()));
		}
		complaintDTO.setEvidenceImages(files);
		return complaintDTO;
	}

	private ComplaintEntity convertBoToEntity(ComplaintBO complaintBO) {

		// Convert BO to Entity
		ComplaintEntity complaintEntity = new ComplaintEntity();
		complaintEntity.setUser(complaintBO.getUser());
		complaintEntity.setUserId(complaintBO.getUserId());
		complaintEntity.setUsername(complaintBO.getUsername());
		complaintEntity.setTitle(complaintBO.getTitle());
		complaintEntity.setDescription(complaintBO.getDescription());
		complaintEntity.setStatus(complaintBO.getStatus());
		complaintEntity.setCreatedAt(complaintBO.getCreatedAt());
		complaintEntity.setUpdatedAt(complaintBO.getUpdatedAt());
		complaintEntity.setCrimeType(complaintBO.getCrimeType());
		complaintEntity.setLocation(complaintBO.getLocation());
		complaintEntity.setUserEmail(complaintBO.getUserEmail());
		complaintEntity.setLiveLocationLink(complaintBO.getLiveLocationLink());
		complaintEntity.setPoliceStation(complaintBO.getPoliceStation());
		complaintEntity.setEvidenceImages(complaintBO.getEvidenceImages());

		return complaintEntity;
	}

	public List<FIRBO> findFIRByOfficerId(Long policeId) {

		List<FIREntity> allFIREntity = complaintsRepository.findFIRByOfficerId(policeId);
		System.out.println("FIREntity Entity==" + allFIREntity);
		if (allFIREntity != null && !allFIREntity.isEmpty()) {

			System.out.println();

			return allFIREntity.stream().map(fir -> FIRBO.of()
					.caseOfficerNotes(fir.getCaseOfficerNotes())
					.complaintId(fir.getComplaint().getId())
					.createdAt(fir.getCreatedAt())
					.crimeType(fir.getCrimeType())
					.description(fir.getDescription())
					.firNumber(fir.getFirNumber())
					.id(fir.getId())
					.isUnderInvestigation(fir.getIsUnderInvestigation())
					.location(fir.getLocation())
					.policeOfficerId(fir.getPoliceOfficer().getId())
					.status(fir.getStatus())
					.title(fir.getTitle())
					.updatedAt(fir.getUpdatedAt())
					.userId(fir.getUser().getId())
					
					.build()).collect(Collectors.toList());
		}

		return Collections.emptyList();

	}

}
