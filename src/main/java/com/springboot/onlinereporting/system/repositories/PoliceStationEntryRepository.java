package com.springboot.onlinereporting.system.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.PoliceStationEntry;

@Repository
public interface PoliceStationEntryRepository extends JpaRepository<PoliceStationEntry, Long> {

	@Query("select st from PoliceStationEntry st where st.stationName =:stationName OR st.stationCode =:stationCode OR st.emailAddress =:emailid")
	public PoliceStationEntry getStationNameORstationCodeORemailAddress(@Param("stationName") String stationName,
			@Param("stationCode") String stationCode, @Param("emailid") String emailid);

	@Query("select  st.stationCode as stationCode,st.stationName as stationName from PoliceStationEntry st")
	public List<Object[]> getAllpoliceStation();

	public PoliceStationEntry findByStationCode(String stationCode);

	public List<PoliceStationEntry> findAll();

	
}