package com.springboot.onlinereporting.system.springsecurity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.springsecurity.principal.UserPrincipal;

@Service
public class MyUserDetailsService implements UserDetailsService {
	@Autowired
	private com.springboot.onlinereporting.system.repositories.UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserEntity user = userRepository.findByEmailid(username)
				.orElseThrow(() -> new UsernameNotFoundException("USER NOT FOUND"));

		return new UserPrincipal(user);
	}

}
