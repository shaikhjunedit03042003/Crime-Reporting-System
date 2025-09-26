package com.springboot.onlinereporting.system.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.DTO.PoliceStationEntryDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.PoliceStationEntry;
import com.springboot.onlinereporting.system.helper.ByteArraytoMultipartFile;
import com.springboot.onlinereporting.system.mapper.PoliceOfficerMapper;
import com.springboot.onlinereporting.system.repositories.ComplaintsRepository;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.repositories.PoliceStationEntryRepository;

//MockMultipartFile
@Service
public class PoliceOfficerService {
	@Autowired
	private PoliceOfficerRepository policeOfficerRepository;

	@Autowired
	private PoliceStationEntryRepository policeStationEntryRepository;

	@Autowired
	private PoliceOfficerMapper policeOfficerMapper;

	@Autowired
	private ComplaintsRepository complaintsRepository;

	public PoliceOfficerDTO savePoliceOfficers(PoliceOfficerBO bo) {
		PoliceOfficerEntity policeOfficerEntity = new PoliceOfficerEntity();
		policeOfficerEntity.setBadgeNumber(bo.getBadgeNumber());
		policeOfficerEntity.setContactNumber(bo.getContactNumber());
		policeOfficerEntity.setEmail(bo.getEmail());
		policeOfficerEntity.setId(bo.getId());
		policeOfficerEntity.setImgaes(bo.getImages());
		policeOfficerEntity.setName(bo.getName());
		policeOfficerEntity.setPoliceStation(bo.getPoliceStation());
		policeOfficerEntity.setPoliceStationselect(bo.getPoliceStationselect());
		policeOfficerEntity.setRank(bo.getRank());
		policeOfficerEntity.setFilename(bo.getFilename());
		policeOfficerEntity.setContentType(bo.getContentType());

		String policeStationCode = bo.getPoliceStationselect();
		PoliceStationEntry policeStationEntry = policeStationEntryRepository.findByStationCode(policeStationCode);
		System.out
				.println("policeStationEntry at time of police officer save in the databasedddd=" + policeStationEntry);

		policeOfficerEntity.setPoliceStation(policeStationEntry);
		policeOfficerEntity.setPoliceStationselect(policeStationEntry.getStationName());

		PoliceOfficerEntity saveEntity = policeOfficerRepository.save(policeOfficerEntity);
		PoliceOfficerDTO policeOfficerDTO = new PoliceOfficerDTO();
		policeOfficerDTO.setBadgeNumber(saveEntity.getBadgeNumber());
		policeOfficerDTO.setContactNumber(saveEntity.getContactNumber());
		policeOfficerDTO.setEmail(saveEntity.getEmail());
		policeOfficerDTO.setId(saveEntity.getId());
		policeOfficerDTO.setName(saveEntity.getName());
		if (saveEntity.getImgaes() != null && saveEntity.getImgaes().length > 0) {
			MultipartFile multipartFile = new ByteArraytoMultipartFile(saveEntity.getImgaes(), "policeImages",
					saveEntity.getName(), saveEntity.getContentType());
			policeOfficerDTO.setPoliceImages(multipartFile);
		}

		return policeOfficerMapper.toDTO(saveEntity);
	}

	public boolean getBadgeNumber(String badgeNumber, String policestationcode) {

		if (policeOfficerRepository.findByBadgeNumberAndPoliceStationselect(badgeNumber, policestationcode) != null)
			return true;
		else
			return false;
	}

	// get All PoliceOfficersss hereeee
	public List<PoliceOfficerDTO> getAllPoliceOfficers() {
		List<PoliceOfficerEntity> entities = policeOfficerRepository.findAll();

		return entities.stream()
				.map(entity -> PoliceOfficerDTO.of().badgeNumber(entity.getBadgeNumber()).id(entity.getId())
						.name(entity.getName()).policeStationselect(entity.getPoliceStationselect())
						.contentType(entity.getContentType()).filename(entity.getFilename())

						.email(entity.getEmail()).contactNumber(entity.getContactNumber())

						.rank(entity.getRank()).build())
				.toList();
	}

	public boolean deletePoliceOffiser(Long policeOfficerId) {
		if (policeOfficerRepository.existsById(policeOfficerId)) {
			policeOfficerRepository.deleteById(policeOfficerId);
			return true;

		}
		return false;
	}

	public PoliceOfficerBO getPoliceOfficerById(Long id) {
		PoliceOfficerEntity entity = policeOfficerRepository.findById(id).get();
		if (entity != null) {
			return PoliceOfficerBO.of().badgeNumber(entity.getBadgeNumber()).contactNumber(entity.getContactNumber())
					.contentType(entity.getContentType()).email(entity.getEmail()).filename(entity.getFilename())
					.id(entity.getId()).images(entity.getImgaes()).name(entity.getName())
					.policeStation(entity.getPoliceStation()).policeStationselect(entity.getPoliceStationselect())
					.rank(entity.getRank()).build();

		}

		return null;
	}

	public PoliceOfficerBO updatePoliceOfficer(Long policeId, PoliceOfficerBO policeOfficerBO) {
		PoliceOfficerEntity entity = policeOfficerRepository.findById(policeId)
				.orElseThrow(() -> new RuntimeException("PoliceOfficer Not Found"));
		String policeStationCode = policeOfficerBO.getPoliceStationselect();
		PoliceStationEntry policeStationEntry = policeStationEntryRepository.findByStationCode(policeStationCode);
		System.out
				.println("policeStationEntry at time of police officer save in the databasedddd=" + policeStationEntry);

		policeOfficerBO.setPoliceStation(policeStationEntry);

		if (entity != null) {
			PoliceOfficerEntity entityForSave = PoliceOfficerEntity.of().badgeNumber(policeOfficerBO.getBadgeNumber())
					.contactNumber(policeOfficerBO.getContactNumber()).contentType(policeOfficerBO.getContentType())
					.email(policeOfficerBO.getEmail()).filename(policeOfficerBO.getFilename())
					.id(policeOfficerBO.getId()).imgaes(policeOfficerBO.getImages()).name(policeOfficerBO.getName())
					.policeStation(policeOfficerBO.getPoliceStation())
					.policeStationselect(policeOfficerBO.getPoliceStationselect()).rank(policeOfficerBO.getRank())
					.build();
			PoliceOfficerEntity policeEntity2 = policeOfficerRepository.save(entityForSave);
			return PoliceOfficerBO.of().badgeNumber(policeEntity2.getBadgeNumber())
					.contactNumber(policeEntity2.getContactNumber()).contentType(policeEntity2.getContentType())
					.email(policeEntity2.getEmail()).filename(policeEntity2.getFilename()).id(policeEntity2.getId())
					.images(policeEntity2.getImgaes()).name(policeEntity2.getName())
					.policeStation(policeEntity2.getPoliceStation())
					.policeStationselect(policeEntity2.getPoliceStationselect()).rank(policeEntity2.getRank())

					.build();

		}
		return null;
	}

	// get Police Officer by Badge number
	public PoliceOfficerBO getPoliceOfficer(String badgeNumber) {
		PoliceOfficerEntity policeOfficerEntity = policeOfficerRepository.findByBadgeNumber(badgeNumber);
		if (policeOfficerEntity != null) {
			return PoliceOfficerBO.of().badgeNumber(policeOfficerEntity.getBadgeNumber())
					.contactNumber(policeOfficerEntity.getContactNumber())
					.contentType(policeOfficerEntity.getContentType()).email(policeOfficerEntity.getEmail())
					.filename(policeOfficerEntity.getFilename()).id(policeOfficerEntity.getId())
					.images(policeOfficerEntity.getImgaes()).name(policeOfficerEntity.getName())
					.policeStation(policeOfficerEntity.getPoliceStation())
					.policeStationselect(policeOfficerEntity.getPoliceStationselect())
					.rank(policeOfficerEntity.getRank())

					.build();

		}
		return null;
	}

	public ComplaintDTO findComplaintById(Long complaitId) {

		ComplaintEntity complaintEntity = complaintsRepository.findById(complaitId)
				.orElseThrow(() -> new RuntimeException("Complain NOT FOUND"));

		if (complaintEntity != null) {
			return ComplaintDTO.of()
					.createdAt(complaintEntity.getCreatedAt())
					.crimeType(complaintEntity.getCrimeType())
					.description(complaintEntity.getDescription())
					//.evidenceImages(complaintEntity.getEvidenceImages())
					.id(complaintEntity.getId())
					.liveLocationLink(complaintEntity.getLiveLocationLink())
					.location(complaintEntity.getLocation())
					.policeStation(complaintEntity.getPoliceStation())
					.status(complaintEntity.getStatus())
					.title(complaintEntity.getTitle())
					.updatedAt(complaintEntity.getUpdatedAt())
					.userEmail(complaintEntity.getUserEmail())
					.userId(complaintEntity.getUser().getId())
					.username(complaintEntity.getUsername())
					
					
					.build();

		}
		return null;
	}
}
