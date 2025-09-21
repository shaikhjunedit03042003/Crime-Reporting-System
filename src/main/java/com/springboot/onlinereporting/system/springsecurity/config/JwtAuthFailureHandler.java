package com.springboot.onlinereporting.system.springsecurity.config;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        
        String errorParam = "error=" + (exception.getMessage().contains("Bad credentials") ? "invalidCredentials" : "general");
        String loginUrl = "/onlinecrimereportingsystem/login?" + errorParam;
        
        getRedirectStrategy().sendRedirect(request, response, loginUrl);
    }
}