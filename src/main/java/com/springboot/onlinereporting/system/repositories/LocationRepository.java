package com.springboot.onlinereporting.system.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface LocationRepository extends JpaRepository<com.springboot.onlinereporting.system.entities.Location,Long> {

}
