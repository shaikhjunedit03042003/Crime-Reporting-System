package com.springboot.onlinereporting.system.BO;

import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.DTO.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderMethodName = "of")
public class UserBO {

    private Long id;
    private String username;
    private String emailid;
    private String password;
    private String role;
    private String message;
    private byte[] image;
    private boolean agreement;
    private String secretKey;
    
    private String filename;
    private String contentType;
}

