package com.springboot.onlinereporting.system.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.BO.UserBO;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.repositories.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	

	public UserEntity saveUsers(UserEntity user) {
		
		UserEntity user_result = userRepository.save(user);

		return user_result;
	}
	public Optional<UserEntity> getUserByUsername(String emaild) {
		return userRepository.getUserByUsername(emaild);
		
	}
	
	public UserBO updateUser(UserEntity userEntity) {
	    
	    UserEntity existingUser = userRepository.findById(userEntity.getId())
	            .orElseThrow(() -> new RuntimeException("User not found with id: " + userEntity.getId()));

	    
	    existingUser.setUsername(userEntity.getUsername());
	    existingUser.setEmailid(userEntity.getEmailid());
	    existingUser.setMessage(userEntity.getMessage());
	    existingUser.setImage(userEntity.getImage());
	    existingUser.setFilename(userEntity.getFilename());
	    existingUser.setContentType(userEntity.getContentType());

	    UserEntity user_result = userRepository.save(existingUser);

	    return UserBO.of()
	            .id(user_result.getId())
	            .username(user_result.getUsername())
	            .emailid(user_result.getEmailid())
	            .message(user_result.getMessage())
	            .image(user_result.getImage())
	            .filename(user_result.getFilename())
	            .contentType(user_result.getContentType())
	            .role(user_result.getRole())     
	            .password(user_result.getPassword()) 
	            .agreement(user_result.isAgreement())
	            .secretKey(user_result.getSecretKey())
	            .build();
	}

	

}
