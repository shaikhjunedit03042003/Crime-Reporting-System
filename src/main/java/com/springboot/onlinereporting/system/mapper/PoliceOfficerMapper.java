package com.springboot.onlinereporting.system.mapper;

import org.mapstruct.Mapper;

import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;

@Mapper(componentModel = "spring")
public interface PoliceOfficerMapper {

	public PoliceOfficerBO toBo(PoliceOfficerDTO dto);

	public PoliceOfficerEntity toEntity(PoliceOfficerBO bo);

	public PoliceOfficerDTO toDTO(PoliceOfficerEntity entity);

}
