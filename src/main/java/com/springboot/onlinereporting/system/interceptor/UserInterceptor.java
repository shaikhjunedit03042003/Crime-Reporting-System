package com.springboot.onlinereporting.system.interceptor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.springsecurity.principal.UserPrincipal;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class UserInterceptor implements HandlerInterceptor {

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) throws Exception {
        if (modelAndView != null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !(auth.getPrincipal() instanceof String)) {
                UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
                UserEntity loggedUser = userPrincipal.getUser(); 
                modelAndView.getModel().put("loggedUser", loggedUser);
            }
        }
    }
}