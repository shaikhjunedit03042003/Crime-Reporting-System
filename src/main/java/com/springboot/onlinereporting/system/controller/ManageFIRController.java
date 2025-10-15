package com.springboot.onlinereporting.system.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.springboot.onlinereporting.system.BO.FIRBO;
import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.DTO.FIRDTO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.FIREntity;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.repositories.ComplaintsRepository;
import com.springboot.onlinereporting.system.repositories.FIRRepository;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.repositories.UserRepository;
import com.springboot.onlinereporting.system.services.ComplaintServce;
import com.springboot.onlinereporting.system.services.FIRService;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/onlinecrimereportingsystem/police/manage/fir")
public class ManageFIRController {
	@Autowired
	private PoliceOfficerService policeOfficerService;

	@Autowired
	private ComplaintsRepository complaintsRepository;

	@Autowired
	private ComplaintServce complaintService;

	@Autowired
	private FIRService firService;

	@Autowired
	private FIRRepository firRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PoliceOfficerRepository policeOfficerRepository;

	@GetMapping({ "", "/" })
	public String policeViewComplaints(Model model, HttpSession session, RedirectAttributes redirectAttributes) {

		try {
			UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
			if (loggedUser != null) {
				// PoliceOfficer BO BO
				PoliceOfficerBO policeOfficerBO = policeOfficerService.getPoliceOfficer(loggedUser.getSecretKey());
				if (policeOfficerBO != null) {

					System.out.println("policeOfficerBO.getId()==" + policeOfficerBO.getId());
					List<FIRBO> firBO = complaintService.findFIRByOfficerId(policeOfficerBO.getId());

					System.out.println("firBO===" + firBO);
					List<FIRDTO> firDTO = firBO.stream()
							.map(fir -> FIRDTO.of().caseOfficerNotes(fir.getCaseOfficerNotes())
									.complaintId(fir.getComplaintId()).createdAt(fir.getCreatedAt())
									.crimeType(fir.getCrimeType()).status(fir.getStatus())
									.policeOfficerId(fir.getPoliceOfficerId()).description(fir.getDescription())
									.firNumber(fir.getFirNumber()).id(fir.getId())
									.isUnderInvestigation(fir.getIsUnderInvestigation()).location(fir.getLocation())
									.policeOfficerId(fir.getPoliceOfficerId()).title(fir.getTitle())
									.updatedAt(fir.getUpdatedAt()).userId(fir.getUserId())

									.build())
							.collect(Collectors.toList());

					model.addAttribute("firDTOs", firDTO);
					model.addAttribute("loggedUser", loggedUser);

					return "polices/manage-firs";

				}

			} else {
				model.addAttribute("errorMessage", "Please Login First !!!");
				redirectAttributes.addFlashAttribute("errorMessage", "Please Login First !!!");
				return "redirect:/onlinecrimereportingsystem/login";
			}
			model.addAttribute("errorMessage", "Please Login First !!!");
			return "redirect:/onlinecrimereportingsystem/login";
		} catch (Exception e) {

			e.printStackTrace();
			model.addAttribute("errorMessage", "Errror:==" + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", "Errror:==" + e.getMessage());

			return "redirect:/onlinecrimereportingsystem/login";
		}
	}

	@GetMapping("/view-fir")
	public String showupdateFIRFromComplaint(@RequestParam("complaintId") Long complaintId,
			@RequestParam("firId") Long firId, Model model, HttpSession session,
			RedirectAttributes redirectAttributes) {
		try {
			UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
			if (loggedUser == null) {
				model.addAttribute("errorMessage", "Please log in first");
				redirectAttributes.addFlashAttribute("errorMessage", "Please Login First !!");
				return "redirect:/onlinecrimereportingsystem/login";
			}
			model.addAttribute("loggedUser", loggedUser);

			// Fetch the complaint
			ComplaintEntity complaint = complaintsRepository.findById(complaintId)
					.orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

			complaint.setUserId(complaint.getUser().getId());

			ComplaintDTO complaintDTO = ComplaintDTO.of().assignedOfficer(complaint.getAssignedOfficer())
					.createdAt(complaint.getCreatedAt()).crimeType(complaint.getCrimeType())
					.description(complaint.getDescription())
					// .evidenceImages(complaint.getEvidenceImages())
					.id(complaint.getId()).liveLocationLink(complaint.getLiveLocationLink())
					.location(complaint.getLocation()).policeStation(complaint.getPoliceStation())
					.status(complaint.getStatus()).title(complaint.getTitle()).username(complaint.getUsername())
					.userId(complaint.getUser().getId()).userEmail(complaint.getUserEmail()).user(complaint.getUser())
					.updatedAt(complaint.getUpdatedAt())

					.build();

			// Fetch the police officer details
			PoliceOfficerBO policeOfficerBO = policeOfficerService.getPoliceOfficer(loggedUser.getSecretKey());
			if (policeOfficerBO == null) {
				throw new RuntimeException("Police officer not found for logged user");
			}
			PoliceOfficerDTO loggedOfficer = PoliceOfficerDTO.of()
					.assignedComplaints(policeOfficerBO.getAssignedComplaints()).name(policeOfficerBO.getName())
					.badgeNumber(policeOfficerBO.getBadgeNumber()).contactNumber(policeOfficerBO.getContactNumber())
					.contentType(policeOfficerBO.getContentType()).email(policeOfficerBO.getEmail())
					.filename(policeOfficerBO.getFilename()).id(policeOfficerBO.getId())
					// .image(policeOfficerBO.getImages()).name(policeOfficerBO.getName())
					.policeStation(policeOfficerBO.getPoliceStation())
					.policeStationselect(policeOfficerBO.getPoliceStationselect()).rank(policeOfficerBO.getRank())
					.build();

			FIRDTO firDTO = firService.findById(firId);

			System.out.println(" view complaintDTO==" + complaintDTO);
			System.out.println(" view loggedOfficer===" + loggedOfficer);
			System.out.println("view  firDTO==" + firDTO);

			model.addAttribute("logcomplaints", complaintDTO);
			model.addAttribute("loggedOfficer", loggedOfficer);
			model.addAttribute("fir", firDTO);
			model.addAttribute("title", "View FIR from Complaint");
			return "polices/police-view-fir";
		} catch (Exception e) {
			model.addAttribute("errorMessage", "Error fetching complaint for FIR Update: " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage",
					"Error fetching complaint for FIR Updattion: " + e.getMessage());
			return "redirect:/onlinecrimereportingsystem/police/manage/fir";
		}
	}

	@PostMapping("/update-fir")
	public String createFIR(@Valid @ModelAttribute("fir") FIRDTO firDTO, BindingResult result, Model model,
			HttpSession session, RedirectAttributes redirectAttributes) {

		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
		System.out.println("firDTO for updateee===" + firDTO);
		ComplaintEntity complaint = complaintsRepository.findById(firDTO.getComplaintId())
				.orElseThrow(() -> new RuntimeException("Complaint not found"));

		complaint.setUserId(complaint.getUser().getId());

		ComplaintDTO complaintDTO = ComplaintDTO.of().assignedOfficer(complaint.getAssignedOfficer())
				.createdAt(complaint.getCreatedAt()).crimeType(complaint.getCrimeType())
				.description(complaint.getDescription())
				// .evidenceImages(complaint.getEvidenceImages())
				.id(complaint.getId()).liveLocationLink(complaint.getLiveLocationLink())
				.location(complaint.getLocation()).policeStation(complaint.getPoliceStation())
				.status(complaint.getStatus()).title(complaint.getTitle()).username(complaint.getUsername())
				.userId(complaint.getUser().getId()).userEmail(complaint.getUserEmail()).user(complaint.getUser())
				.updatedAt(complaint.getUpdatedAt())

				.build();

		PoliceOfficerBO policeOfficerBO = policeOfficerService.getPoliceOfficer(loggedUser.getSecretKey());
		PoliceOfficerDTO loggedOfficer = PoliceOfficerDTO.of()
				.assignedComplaints(policeOfficerBO.getAssignedComplaints())
				.badgeNumber(policeOfficerBO.getBadgeNumber()).contactNumber(policeOfficerBO.getContactNumber())
				.contentType(policeOfficerBO.getContentType()).email(policeOfficerBO.getEmail())
				.filename(policeOfficerBO.getFilename()).id(policeOfficerBO.getId())
				.policeStation(policeOfficerBO.getPoliceStation())
				.policeStationselect(policeOfficerBO.getPoliceStationselect()).rank(policeOfficerBO.getRank()).build();
		try {

			// Check for existing FIR with the same complaintId
			Optional<FIREntity> existingFIR = firRepository.findByComplaintId(firDTO.getComplaintId());
			if (existingFIR.isPresent()) {
				System.out.println("An FIR already exists for this complaint. Then we can Update.");
				System.out.println("complaint==" + complaint);
				System.out.println("loggedOfficer===" + loggedOfficer);
				System.out.println("firDTO==" + firDTO);
				System.out.println("loggedUser==" + loggedUser);

				FIREntity saveEntity = existingFIR.get();
				saveEntity.setUpdatedAt(firDTO.getUpdatedAt());
				saveEntity.setCaseOfficerNotes(firDTO.getCaseOfficerNotes());
				saveEntity.setStatus(firDTO.getStatus());
				System.out.println("befor eSave==" + saveEntity);

				FIREntity afterSave = firRepository.save(saveEntity);
				System.out.println("After Saved:==" + afterSave);
				redirectAttributes.addFlashAttribute("loggedUser", loggedUser);

				redirectAttributes.addFlashAttribute("title", "Update FIR from Complaint");
				redirectAttributes.addFlashAttribute("successMessage", "FIR Update Successfully!!!!!!!!!!!!");
				return "redirect:/onlinecrimereportingsystem/police/manage/fir";
			} else {

				System.out.println("FIR Failed  Updateee........");
				redirectAttributes.addFlashAttribute("loggedUser", loggedUser);
				model.addAttribute("logcomplaints", complaintDTO);
				model.addAttribute("loggedOfficer", loggedOfficer);
				model.addAttribute("fir", firDTO);

				redirectAttributes.addFlashAttribute("errorMessage", "FIR not Exits");
				return "poilces/police-view-fir";
			}

		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("complaint==" + complaint);
			System.out.println("loggedOfficer===" + loggedOfficer);
			System.out.println("firDTO==" + firDTO);
			System.out.println("loggedUser==" + loggedUser);

			System.out.println("Rror MEssage:==" + e.getMessage());
			model.addAttribute("errorMessage", "Error creating FIR: " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", "Error creating FIR: " + e.getMessage());
			redirectAttributes.addFlashAttribute("loggedUser", loggedUser);
			redirectAttributes.addFlashAttribute("logcomplaints", complaint);
			redirectAttributes.addFlashAttribute("fir", firDTO);
			return "redirect:/onlinecrimereportingsystem/police/manage/fir";
		}
	}

}
