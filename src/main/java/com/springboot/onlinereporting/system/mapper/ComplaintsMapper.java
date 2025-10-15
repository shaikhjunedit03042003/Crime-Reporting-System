package com.springboot.onlinereporting.system.mapper;

import org.mapstruct.Mapper;

import com.springboot.onlinereporting.system.BO.ComplaintBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;

@Mapper(componentModel = "spring")
public interface ComplaintsMapper {

	ComplaintBO toBo(ComplaintDTO dto);


	ComplaintEntity toEntity(ComplaintBO bo);

}
