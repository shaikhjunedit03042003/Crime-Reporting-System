package com.springboot.onlinereporting.system.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.entities.Location;
import com.springboot.onlinereporting.system.repositories.LocationRepository;

@Service
public class LocationServce {

	@Autowired
	private LocationRepository reposLocationRepository;

	public void saveLocation(Location loc) {
		reposLocationRepository.save(loc);

	}
}
