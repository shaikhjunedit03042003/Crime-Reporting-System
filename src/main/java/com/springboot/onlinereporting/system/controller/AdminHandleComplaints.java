package com.springboot.onlinereporting.system.controller;

import com.springboot.onlinereporting.system.BO.ComplaintBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.repositories.ComplaintsRepository;
import com.springboot.onlinereporting.system.repositories.EvidenceImageRepository;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.services.ComplaintServce;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/onlinecrimereportingsystem/admins/adminhandlecomplaints")
public class AdminHandleComplaints {
    @Autowired
    private ComplaintServce complaintService; // Fixed typo
    @Autowired
    private PoliceOfficerRepository policeOfficerRepository;
    @Autowired
    private PoliceOfficerService policeOfficerService;
    @Autowired
    private ComplaintsRepository complaintsRepository;
    
    @Autowired
    private EvidenceImageRepository evidenceImageRepository;

    @GetMapping("/adminviewsAllsComplaints")
    public String viewAllComplains(Model model, HttpSession session) {
        try {
            List<ComplaintBO> bocomplaints = complaintService.getAllComplaints();
            System.out.println("Fetched " + (bocomplaints != null ? bocomplaints.size() : 0) + " complaints");
            if (bocomplaints != null) {

                List<ComplaintDTO> complaints = bocomplaints.stream()
                        .map(bo -> ComplaintDTO.of()
                                .createdAt(bo.getCreatedAt())
                                .crimeType(bo.getCrimeType())
                                .description(bo.getDescription())
                                .id(bo.getId())
                                .liveLocationLink(bo.getLiveLocationLink())
                                .location(bo.getLocation())
                                .policeStation(bo.getPoliceStation())
                                .status(bo.getStatus())
                                .title(bo.getTitle())
                                .updatedAt(bo.getUpdatedAt())
                                .userId(bo.getUserId())
                                .username(bo.getUsername())
                                .build())
                        .collect(Collectors.toList());

                // ✅ Extract distinct police stations
                List<String> policeStations = complaints.stream()
                        .map(ComplaintDTO::getPoliceStation)
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());

                model.addAttribute("complaints", complaints);
                model.addAttribute("policeStations", policeStations);

                return "admin/admin-view-all-complaints";
            }

            model.addAttribute("error", "No complaints found");
            return "error";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Error: " + e.getMessage());
            return "error";
        }
    }

    @GetMapping("/view/{id}")
    public String viewComplaint(@PathVariable("id") Long id, Model model) {
        try {
            ComplaintDTO complaintDTO = complaintService.findComplaintById(id);
           System.out.println("First check Compalintsss==>"+complaintDTO);
            if (complaintDTO != null) {
                model.addAttribute("logcomplaints", complaintDTO);
                Map<Long, String> policeOfficers = policeOfficerService.getPoliceOfficersByStation(complaintDTO.getPoliceStation());
                model.addAttribute("policeOfficers", policeOfficers);
                
                // Set transient userId
       	     if (complaintDTO.getUser() != null) {
       	    	complaintDTO.setUserId(complaintDTO.getUser().getId());
       	     }
       	        System.out.println("complaint======>>"+complaintDTO);
       	        List<EvidenceImageEntity> evidenceList = evidenceImageRepository.findByComplaints_Id(id);

       	        List<Map<String, String>> images = evidenceList.stream()
       	                .map(ev -> {
       	                    Map<String, String> map = new HashMap<>();
       	                    map.put("fileName", ev.getFileName());
       	                    map.put("fileType", ev.getContentType());
       	                    map.put("data", Base64.getEncoder().encodeToString(ev.getContent()));
       	                    return map;
       	                })
       	                .collect(Collectors.toList());
       	        System.out.println("images=="+images);

       	        model.addAttribute("images", images);
                
                
                return "admin/admin-view-user-complaint";
            } else {
                model.addAttribute("errorMessage", "Complaint doesn't exist");
                return "redirect:/onlinecrimereportingsystem/admins/adminhandlecomplaints/adminviewsAllsComplaints";
            }
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "Error: " + e.getMessage());
            return "redirect:/onlinecrimereportingsystem/admins/adminhandlecomplaints/adminviewsAllsComplaints";
        }
    }

    @GetMapping("/policeofficerbtstation")
    public ResponseEntity<Map<Long, String>> getPoliceOfficersByStation(@RequestParam String policeStation) {
        System.out.println("Received policeStation: " + policeStation);
        Map<Long, String> policeOfficers = policeOfficerService.getPoliceOfficersByStation(policeStation);
        if (policeOfficers != null && !policeOfficers.isEmpty()) {
            return ResponseEntity.ok(policeOfficers);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/assignPoliceOfficer")
    public String assignPoliceOfficer(@RequestParam("policeOfficers") String policeOfficerId,
                                     @Valid @ModelAttribute("logcomplaints") ComplaintDTO logcomplaints,
                                     BindingResult result, Model model, RedirectAttributes redirectAttributes) {
		/*
		 * if (result.hasErrors()) { model.addAttribute("errorMessage",
		 * "Invalid complaint data"); model.addAttribute("policeOfficers",
		 * policeOfficerService.getPoliceOfficersByStation(logcomplaints.
		 * getPoliceStation())); return "admin/admin-view-user-complaint"; }
		 */
        try {
            Long policeId = Long.parseLong(policeOfficerId);
            System.out.println("policeId: " + policeId);

            PoliceOfficerEntity policeOfficerEntity = policeOfficerRepository.findById(policeId)
                    .orElseThrow(() -> new RuntimeException("Police Officer not found"));
            System.out.println("policeOfficerEntity ID: " + policeOfficerEntity.getId());

            ComplaintEntity complaintEntity = complaintsRepository.findById(logcomplaints.getId())
                    .orElseThrow(() -> new RuntimeException("Complaint not found"));
            System.out.println("complaintEntity ID: " + complaintEntity.getId());

            complaintEntity.setAssignedOfficer(policeOfficerEntity);
            complaintEntity.setStatus(logcomplaints.getStatus());
            complaintEntity.setUpdatedAt(LocalDateTime.now());
            System.out.println("logcomplaints.getStatus=="+logcomplaints.getStatus());
            policeOfficerEntity.getAssignedComplaints().add(complaintEntity);
           

            ComplaintEntity complaintSave = complaintsRepository.save(complaintEntity);
            System.out.println("After Save complaintSave ID: " + complaintSave.getId());

            if (complaintSave != null) {
                redirectAttributes.addFlashAttribute("successMessage", "Officer Assigned Successfully!");
                return "redirect:/onlinecrimereportingsystem/admins/adminhandlecomplaints/adminviewsAllsComplaints";
            } else {
                model.addAttribute("logcomplaints", logcomplaints);
                model.addAttribute("errorMessage", "Failed to assign officer!");
                model.addAttribute("policeOfficers", policeOfficerService.getPoliceOfficersByStation(logcomplaints.getPoliceStation()));
                return "admin/admin-view-user-complaint";
            }
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("logcomplaints", logcomplaints);
            model.addAttribute("errorMessage", "Error: " + e.getMessage());
            model.addAttribute("policeOfficers", policeOfficerService.getPoliceOfficersByStation(logcomplaints.getPoliceStation()));
            return "admin/admin-view-user-complaint";
        }
    }
}