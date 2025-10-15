package com.springboot.onlinereporting.system.springsecurity.filter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.springboot.onlinereporting.system.springsecurity.service.JWTService;
import com.springboot.onlinereporting.system.springsecurity.service.MyUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JWTService jwtService;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

		/*
		 * String path = request.getRequestURI(); if
		 * (path.startsWith("/onlinecrimereportingsystem/login") ||
		 * path.startsWith("/onlinecrimereportingsystem/signup") ||
		 * path.startsWith("/onlinecrimereportingsystem/do_register") ||
		 * path.startsWith("/onlinecrimereportingsystem/otp")) {
		 * filterChain.doFilter(request, response); return; }
		 */

        String token = null;
        String username = null;

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie != null && "jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null) {
            try {
                username = jwtService.extractUserName(token);
                UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);

                if (jwtService.validateToken(token, userDetails)
                        && SecurityContextHolder.getContext().getAuthentication() == null) {

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (UsernameNotFoundException e) {
                logger.error("User not found: " + username, e);
                SecurityContextHolder.clearContext();
                response.sendRedirect("/onlinecrimereportingsystem/login?error=userNotFound");
                return;
            } catch (Exception e) {
                logger.error("Invalid token: " + e.getMessage(), e);
                SecurityContextHolder.clearContext();
                response.sendRedirect("/onlinecrimereportingsystem/login?error=invalidToken");
                return;
            }
        } else {
          //  logger.warn("No token found in header or cookie for request: " + path);
        }

        filterChain.doFilter(request, response);
    }
}