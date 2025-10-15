package com.springboot.onlinereporting.system.springsecurity.principal;

import java.util.Collection;
import java.util.HashSet;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.springboot.onlinereporting.system.entities.UserEntity;

public class UserPrincipal implements UserDetails {
	private UserEntity user;

	public UserPrincipal(UserEntity user) {
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		HashSet<SimpleGrantedAuthority> role = new HashSet<>();
		System.out.println("this.user.getRole())=="+this.user.getRole());
		role.add(new SimpleGrantedAuthority("ROLE_"+this.user.getRole()));
		return role;

		
	}

	@Override
	public String getPassword() {
		return this.user.getPassword();
	}

	@Override
	public String getUsername() {
		return this.user.getEmailid();
	}

	public UserEntity getUser() {
	    return this.user;
	}


}
