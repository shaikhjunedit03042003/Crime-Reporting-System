package com.springboot.onlinereporting.system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.PoliceLoginDTO;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.repositories.PoliceLoginRepository;

@Service
public class PoliceLoginService {
	@Autowired
	private PoliceLoginRepository policeLoginRepository;

	public PoliceOfficerBO getPoliceOfficer(String email, String contactNumber) {
		PoliceOfficerEntity entity = policeLoginRepository.findByEmailAndContactNumber(email, contactNumber);
		PoliceOfficerBO bo = new PoliceOfficerBO();
		bo.setBadgeNumber(entity.getBadgeNumber());
		bo.setContactNumber(entity.getContactNumber());
		bo.setEmail(entity.getEmail());
		bo.setId(entity.getId());
		bo.setName(entity.getName());
		bo.setPoliceStation(entity.getPoliceStation());
		bo.setPoliceStationselect(entity.getPoliceStationselect());
		bo.setRank(entity.getRank());
		bo.setImages(entity.getImgaes());
		bo.setContentType(entity.getContentType());
		bo.setFilename(entity.getFilename());
		
		return bo;
	}
}
