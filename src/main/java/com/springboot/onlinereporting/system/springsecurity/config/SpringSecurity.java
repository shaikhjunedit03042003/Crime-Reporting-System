package com.springboot.onlinereporting.system.springsecurity.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.springboot.onlinereporting.system.springsecurity.filter.JwtFilter;
import com.springboot.onlinereporting.system.springsecurity.service.MyUserDetailsService;


@Configuration
@EnableWebSecurity
public class SpringSecurity {

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private JwtAuthFailureHandler failureHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthSuccessHandler successHandler)
            throws Exception {

        return http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/onlinecrimereportingsystem/do_register","/onlinecrimereportingsystem/otp/**","/onlinecrimereportingsystem","/onlinecrimereportingsystem/","/onlinecrimereportingsystem/home",
                        		"/onlinecrimereportingsystem/about","/onlinecrimereportingsystem/signup", "/onlinecrimereportingsystem/login", "/css/**", "/js/**","/images/**").permitAll()
                        .requestMatchers("/onlinecrimereportingsystem/admins/**").hasRole("ADMIN")
                        .requestMatchers("/onlinecrimereportingsystem/users/**").hasRole("USER")
                        .anyRequest().authenticated())
                .formLogin(login -> login
                        
                        .loginPage("/onlinecrimereportingsystem/login")
                        .loginProcessingUrl("/onlinecrimereportingsystem/login") 
                        .usernameParameter("emailid") 
                        .passwordParameter("password") 
                        .successHandler(successHandler)
                        .failureHandler(failureHandler)
                        .permitAll())
                .logout(logout -> logout
                        .logoutSuccessUrl("/onlinecrimereportingsystem/login?logout")
                        .deleteCookies("jwt")
                        .permitAll())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
