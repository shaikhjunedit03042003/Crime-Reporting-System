package com.springboot.onlinereporting.system.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.BO.CrimeTypedBO;
import com.springboot.onlinereporting.system.DTO.CrimeTypedDTO;
import com.springboot.onlinereporting.system.entities.CrimeTypedEntity;
import com.springboot.onlinereporting.system.mapper.CrimeTypedMapper;
import com.springboot.onlinereporting.system.repositories.CrimeTypeRepository;

@Service
public class CrimeTypedService {
	@Autowired
	private CrimeTypeRepository crimeTypeRepository;

	@Autowired
	private CrimeTypedMapper crimeTypedMapper;

	public CrimeTypedDTO saveCrimeTyped(CrimeTypedDTO crimeTypedDTO) {

		try {
			// DTO to BO
			CrimeTypedBO ctBO = crimeTypedMapper.toBo(crimeTypedDTO);

			// BO to Entity
			CrimeTypedEntity ctEntity = crimeTypedMapper.toEntity(ctBO);

			// Save Entity here
			CrimeTypedEntity saveEntity = crimeTypeRepository.save(ctEntity);

			return crimeTypedMapper.toDTO(crimeTypedMapper.toBo(saveEntity));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}

	public boolean exitCrimeTyped(String crimeTyped) {
		return crimeTypeRepository.existsByCrimeType(crimeTyped);

	}

	public Map<Long, String> getAllCrimeTypes() {
		List<Object[]> results = crimeTypeRepository.findAllCrimeTypes();
		return results.stream().collect(Collectors.toMap(result -> (Long) result[0], result -> (String) result[1]));
	}/*
		 * public Map<Long, String> getAllCrimeTypes() { List<Object[]> results =
		 * crimeTypeRepository.findAllCrimeTypes(); Map<Long, String> crimeTypesMap =
		 * new HashMap<>();
		 * 
		 * for (Object[] result : results) { Long id = (Long) result[0]; // Cast the
		 * first element (id) to Long String crimeType = (String) result[1]; // Cast the
		 * second element (crimeType) to String crimeTypesMap.put(id, crimeType); // Add
		 * to the map }
		 * 
		 * return crimeTypesMap; }
		 */

}
