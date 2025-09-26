package com.springboot.onlinereporting.system.BO;


import java.time.LocalDateTime;

import com.springboot.onlinereporting.system.entities.ComplaintEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Builder(builderMethodName = "of")
public class EvidenceImageBO {

	private Long id;

	private ComplaintEntity complaint;

	private String fileName;

	private byte[] imageData;

	private String contentType;

	private Long fileSize;

	private LocalDateTime uploadDate;

	private String hashValue;
}
