package com.springboot.onlinereporting.system.entities;


import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

@Entity
@Table(name = "images")
@Data
public class EvidenceImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id")
    private ComplaintEntity complaints;

    @Column(columnDefinition = "DATETIME")
    private Timestamp uploadDate = new Timestamp(System.currentTimeMillis());

    // Custom getter for formatted date
    public String getFormattedUploadDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(uploadDate);
    }
}