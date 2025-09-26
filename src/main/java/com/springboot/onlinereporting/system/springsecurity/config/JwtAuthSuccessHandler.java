package com.springboot.onlinereporting.system.springsecurity.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.repositories.UserRepository;
import com.springboot.onlinereporting.system.springsecurity.service.JWTService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;

@Component
public class JwtAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	@Autowired
	private JWTService jwtService;

	@Autowired
	private UserRepository userRepository;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		// Generate JWT with the authenticated user's email (username)
		String emailId = authentication.getName(); // This is the emailid from login form
		String token = jwtService.generateToken(emailId);
		System.out.println("Generated JWT Token=="+token);
		UserEntity user = userRepository.findByEmailid(emailId).get();
		if (user != null) {
			// Store User entity in session
			request.getSession().setAttribute("loggedUser", user);

		} else {
			String loginUrl = "/onlinecrimereportingsystem/login?" + "error";

			getRedirectStrategy().sendRedirect(request, response, loginUrl);
		}

		// Create secure cookie for JWT
		Cookie jwtCookie = new Cookie("jwt", token);
		jwtCookie.setHttpOnly(true); // Prevent JS access
		jwtCookie.setSecure(true); // HTTPS only (set to false for local testing)
		jwtCookie.setPath("/");
		jwtCookie.setMaxAge((int) (jwtService.getTokenExpiryMs() / 1000)); // Match expiry (10 min)

		response.addCookie(jwtCookie);

		// Redirect based on role (ADMIN vs USER)
		String redirectUrl = determineTargetUrl(authentication);
		getRedirectStrategy().sendRedirect(request, response, redirectUrl);
	}

	private String determineTargetUrl(Authentication authentication) {
		boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ROLE_ADMIN"));

		boolean isPolice = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ROLE_POLICE"));

		boolean isUsers = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ROLE_USER"));

		
		
		System.out.println("isAdmin=="+isAdmin);
		System.out.println("isPolice=="+isPolice);
		System.out.println("isUserrs=="+isUsers);
		if (isAdmin) {
			return "/onlinecrimereportingsystem/admins/dashboard";
		} else if (isPolice) {
			return "/onlinecrimereportingsystem/police/dashboard";
		} else if (isUsers) {
			return "/onlinecrimereportingsystem/users/dashboard";
		} else {
			return "/onlinecrimereportingsystem/login";

		}
	}
}