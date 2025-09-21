package com.springboot.onlinereporting.system.entities;

import java.time.LocalDateTime;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "evidence_images")
public class EvidenceImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "image_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private ComplaintEntity complaint;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData; // For BLOB storage

    @Column(name = "content_type")
    private String contentType; // e.g., image/jpeg

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "upload_date", columnDefinition = "DATETIME")
    private LocalDateTime uploadDate;

    @Column(name = "hash_value")
    private String hashValue; // For forensic integrity (e.g., SHA-256)
}