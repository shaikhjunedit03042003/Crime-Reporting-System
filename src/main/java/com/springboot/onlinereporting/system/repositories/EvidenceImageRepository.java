package com.springboot.onlinereporting.system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
@Repository
public interface EvidenceImageRepository extends JpaRepository<EvidenceImageEntity, Long> {

}
