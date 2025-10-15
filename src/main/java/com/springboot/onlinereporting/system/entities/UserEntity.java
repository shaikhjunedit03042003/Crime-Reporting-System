package com.springboot.onlinereporting.system.entities;

import org.apache.commons.lang3.builder.ToStringExclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderClassName = "of")
@Entity
@Table(name = "USERS")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "username",unique = true, nullable = false)
    private String username;

    @Column(name = "email_id", unique = true, nullable = false)
    private String emailid;

    @Column(name = "password", nullable = false)
    private String password;

    
    private String role;

    @Column(name = "message", length = 1000)
    private String message;

    @Lob
    @Column(name = "image_url", columnDefinition = "LONGBLOB")
    private byte[] image; 

    @Column(name = "agreement")
    private boolean agreement;

    private String secretKey;
    
    

    private String filename;

    private String contentType;

}
