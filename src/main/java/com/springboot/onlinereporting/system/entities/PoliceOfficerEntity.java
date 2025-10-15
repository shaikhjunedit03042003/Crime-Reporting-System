package com.springboot.onlinereporting.system.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder(builderMethodName = "of")
@Setter
@Getter
@Entity
@Table(name = "police_officers")
public class PoliceOfficerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String badgeNumber;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String contactNumber;

    private String policeStationselect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_station_id")
    @ToString.Exclude  
    private PoliceStationEntry policeStation;

    @Column(name = "officer_rank")
    private String rank;

    @Column(name = "police_images", columnDefinition = "LONGBLOB")
    @Lob
    private byte[] imgaes;

    private String filename;

    private String contentType;

    @OneToMany(mappedBy = "assignedOfficer", fetch = FetchType.LAZY,cascade =CascadeType.ALL)
    @ToString.Exclude  
    private List<ComplaintEntity> assignedComplaints=new ArrayList<>();  

    @Override
    public String toString() {
        return "PoliceOfficerEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", badgeNumber='" + badgeNumber + '\'' +
                ", email='" + email + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", policeStationselect='" + policeStationselect + '\'' +
                ", rank='" + rank + '\'' +
                ", filename='" + filename + '\'' +
                ", contentType='" + contentType + '\'' +
                '}';
    }
}