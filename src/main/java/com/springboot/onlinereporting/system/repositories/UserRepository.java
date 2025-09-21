package com.springboot.onlinereporting.system.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.onlinereporting.system.entities.PoliceStationEntry;
import com.springboot.onlinereporting.system.entities.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
	@Query("SELECT u FROM UserEntity u WHERE u.emailid =:email")
	public Optional<UserEntity>getUserByUsername(@Param("email") String emailid);
	
	@Query("SELECT u FROM UserEntity u WHERE u.id =:id")
	public UserEntity getUserById(@Param("id") Long id);
	
	public Optional<UserEntity> findByEmailid(String emailid);

}

