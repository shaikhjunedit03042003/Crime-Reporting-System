package com.springboot.onlinereporting.system.mapper;

import com.springboot.onlinereporting.system.BO.PoliceStationBO;
import com.springboot.onlinereporting.system.DTO.PoliceStationEntryDTO;
import com.springboot.onlinereporting.system.entities.PoliceStationEntry;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PoliceStationMapper {
   public PoliceStationBO toBO(PoliceStationEntryDTO dto);
   public PoliceStationEntry toEntity(PoliceStationBO bo);
   public  PoliceStationEntryDTO toDTO(PoliceStationEntry entity);
}