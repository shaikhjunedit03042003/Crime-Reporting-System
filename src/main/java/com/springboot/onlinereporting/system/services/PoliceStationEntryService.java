package com.springboot.onlinereporting.system.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.BO.PoliceStationBO;
import com.springboot.onlinereporting.system.DTO.PoliceStationEntryDTO;
import com.springboot.onlinereporting.system.entities.PoliceStationEntry;
import com.springboot.onlinereporting.system.repositories.PoliceStationEntryRepository;

@Service
public class PoliceStationEntryService {

	@Autowired
	private PoliceStationEntryRepository policeStationEntryRepository;

	public PoliceStationEntry savePoliceStation(PoliceStationEntry police) {
		return policeStationEntryRepository.save(police);
	}

	public PoliceStationEntry getStationNameORstationCodeORemailAddress(String stationName, String stationCode,
			String emailid) {
		return policeStationEntryRepository.getStationNameORstationCodeORemailAddress(stationName, stationCode,
				emailid);

	}

	public Map<String, String> getAllPoliceStation() {
		List<Object[]> results = policeStationEntryRepository.getAllpoliceStation();
		return results.stream().collect(Collectors.toMap(result -> (String) result[0], result -> (String) result[1]));
	}

	//get All PoliceStation hereeee
	public List<PoliceStationEntryDTO> viewAllPoliceStations() {
		List<PoliceStationEntry> entities = policeStationEntryRepository.findAll();

		return entities.stream()
				.map(entity -> PoliceStationEntryDTO.of().id(entity.getId()).stationName(entity.getStationName())
						.stationCode(entity.getStationCode()).area(entity.getArea()).city(entity.getCity()).build())
				.toList();
	}

	// get Police Station by id
	public PoliceStationBO findPoliceStation(Long id) {
		PoliceStationEntry entity = policeStationEntryRepository.findById(id).get();
		if(entity!=null) {
		return PoliceStationBO.of().addressLine1(entity.getAddressLine1()).addressLine2(entity.getAddressLine2())
				.area(entity.getArea()).city(entity.getCity()).contactNumber(entity.getContactNumber())
				.emailAddress(entity.getEmailAddress()).emergencyNumber(entity.getEmergencyNumber())
				.faxNumber(entity.getFaxNumber()).id(entity.getId()).landMark(entity.getLandMark())
				.pincode(entity.getPincode()).state(entity.getState()).stationCode(entity.getStationCode())
				.stationName(entity.getStationName()).build();
	}
	return null;	
	}

	// update Police Station by Id
	public PoliceStationBO updatePoliceStationById(Long id, PoliceStationBO policeStationBO) {
		PoliceStationEntry entity = policeStationEntryRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Police Station Not Found with Idd" + id));

		System.out.println("entity Entity Object entity ==" + entity);


		if(entity!=null) {
			//BO to Entity
			PoliceStationEntry entityForsaved=PoliceStationEntry.of()
					.addressLine1(policeStationBO.getAddressLine1())
					.addressLine2(policeStationBO.getAddressLine2())
					.area(policeStationBO.getArea())
					.city(policeStationBO.getCity())
					.contactNumber(policeStationBO.getContactNumber())
					.emailAddress(policeStationBO.getEmailAddress())
					.emergencyNumber(policeStationBO.getEmergencyNumber())
					.faxNumber(policeStationBO.getFaxNumber())
					.id(policeStationBO.getId())
					.landMark(policeStationBO.getLandMark())
					.pincode(policeStationBO.getPincode())
					.state(policeStationBO.getState())
					.stationCode(policeStationBO.getStationCode())
					.stationName(policeStationBO.getStationName())
					
					.build();
			PoliceStationEntry saveEntity = policeStationEntryRepository.save(entityForsaved);
			System.out.println("Save  Entity Object saveEntity =" + saveEntity);
			//Entity to BO
			return PoliceStationBO.of().addressLine1(saveEntity.getAddressLine1())
					.addressLine2(saveEntity.getAddressLine2()).area(saveEntity.getArea()).city(saveEntity.getCity())
					.contactNumber(saveEntity.getContactNumber()).emailAddress(saveEntity.getEmailAddress())
					.emergencyNumber(saveEntity.getEmergencyNumber()).faxNumber(saveEntity.getFaxNumber())
					.id(saveEntity.getId()).landMark(saveEntity.getLandMark()).pincode(saveEntity.getPincode())
					.state(saveEntity.getState()).stationCode(saveEntity.getStationCode())
					.stationName(saveEntity.getStationName())

					.build();
			
			
		}
		return null;
		
		
	}

	// delete Police Station
	public boolean deletePoliceStation(Long id) {
		if (policeStationEntryRepository.existsById(id)) {
			policeStationEntryRepository.deleteById(id);
			return true;
		}
		return false;
	}

}
