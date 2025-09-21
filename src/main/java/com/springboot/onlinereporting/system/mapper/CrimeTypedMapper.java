package com.springboot.onlinereporting.system.mapper;

import java.util.Optional;

import org.mapstruct.Mapper;

import com.springboot.onlinereporting.system.BO.CrimeTypedBO;
import com.springboot.onlinereporting.system.DTO.CrimeTypedDTO;
import com.springboot.onlinereporting.system.entities.CrimeTypedEntity;
@Mapper(componentModel = "spring")
public interface CrimeTypedMapper {

	CrimeTypedBO toBo(CrimeTypedDTO ctDTO);

	CrimeTypedEntity toEntity(CrimeTypedBO ctBO);

	CrimeTypedBO toBo(CrimeTypedEntity ctEntity);

	CrimeTypedDTO toDTO(CrimeTypedBO ctBo);

	CrimeTypedBO toBo(Optional<CrimeTypedEntity> entity);

}
