package com.springboot.onlinereporting.system.repositories;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.CrimeTypedEntity;

@Repository
public interface CrimeTypeRepository extends JpaRepository<CrimeTypedEntity, Long> {

	public CrimeTypedEntity findByCrimeType(String crimeType);

	public boolean existsByCrimeType(String crimeType);

	@Query("SELECT c.id AS id, c.crimeType AS crimeType FROM CrimeTypedEntity c")
    List<Object[]> findAllCrimeTypes();

}
