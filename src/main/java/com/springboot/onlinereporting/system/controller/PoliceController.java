package com.springboot.onlinereporting.system.controller;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.springboot.onlinereporting.system.BO.ComplaintBO;
import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.DTO.FIRDTO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
import com.springboot.onlinereporting.system.entities.FIREntity;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.mapper.ComplaintsMapper;
import com.springboot.onlinereporting.system.repositories.ComplaintsRepository;
import com.springboot.onlinereporting.system.repositories.EvidenceImageRepository;
import com.springboot.onlinereporting.system.repositories.FIRRepository;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.repositories.UserRepository;
import com.springboot.onlinereporting.system.services.ComplaintServce;
import com.springboot.onlinereporting.system.services.FIRService;
import com.springboot.onlinereporting.system.services.PoliceLoginService;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;
import com.springboot.onlinereporting.system.springsecurity.principal.UserPrincipal;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/onlinecrimereportingsystem/police")
public class PoliceController {
	@Autowired
	private PoliceLoginService policeLoginService;
	@Autowired
	private PoliceOfficerService policeOfficerService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ComplaintServce complaintService;

	@Autowired
	private ComplaintsRepository complaintsRepository;

	@Autowired
	private PoliceOfficerRepository policeOfficerRepository;

	@Autowired
	private EvidenceImageRepository evidenceImageRepository;

	@Autowired
	private FIRService firService;

	@Autowired
	private ComplaintsMapper complaintsMapper;

	@Autowired
	private FIRRepository firRepository;

	// user home controller
	@GetMapping({ "", "/dashboard", "/policehome" })
	public String userHome(Model model, HttpSession session) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated()) {
			// userDetails is your UserPrincipal
			UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
			UserEntity loggedUser = userPrincipal.getUser(); // expose getUser() in UserPrincipal

			model.addAttribute("loggedUser", loggedUser);
			session.setAttribute("loggedUser", loggedUser);

		}
		model.addAttribute("title", "Police Dashboard - Online Crime Reporting System");
		return "polices/police-dashboard";
	}

	// Police View Complaints

	@GetMapping("/policeviewcomplaints")
	public String policeViewComplaints(Model model, HttpSession session) {

		try {
			UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
			if (loggedUser != null) {
				// PoliceOfficer BO BO
				PoliceOfficerBO policeOfficerBO = policeOfficerService.getPoliceOfficer(loggedUser.getSecretKey());
				if (policeOfficerBO != null) {
					
					System.out.println("policeOfficerBO.getId()=="+policeOfficerBO.getId());
					List<ComplaintBO> complaints = complaintService
							.getComplaintsByPoliceOfficerId(policeOfficerBO.getId());

					System.out.println("BO Compalints complaints" + complaints);
					List<ComplaintDTO> complaintDTOs = complaints.stream()
							.map(complaint -> ComplaintDTO.of().id(complaint.getId()).userId(complaint.getUserId())
									.username(complaint.getUsername()).status(complaint.getStatus())
									.createdAt(complaint.getCreatedAt()).title(complaint.getTitle())

									.build())
							.collect(Collectors.toList());
					System.out.println("complaintDTOs==" + complaintDTOs);
					System.out.println("loggedUser==>>"+loggedUser);
					model.addAttribute("loggedUser", loggedUser);
					model.addAttribute("complaintDTOs", complaintDTOs);
					return "polices/police-views-all-complaints";

				}

			} else {
				model.addAttribute("errorMessage", "Please Login First !!!");
				return "redirect:/onlinecrimereportingsystem/login";
			}
			model.addAttribute("errorMessage", "Please Login First !!!");
			return "redirect:/onlinecrimereportingsystem/login";
		} catch (Exception e) {

			e.printStackTrace();
			model.addAttribute("errorMessage", "Errror:==" + e.getMessage());
			return "redirect:/onlinecrimereportingsystem/login";
		}
	}

	// Complaint update Page Viewss

	@GetMapping("/complaints/view/{id}")
	public String viewComplaintDetails(@PathVariable("id") Long id, Model model, HttpSession session) {
		try {
			UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
			if (loggedUser == null) {
				model.addAttribute("errorMessage", "Please log in first");
				return "redirect:/onlinecrimereportingsystem/login";
			}

			ComplaintEntity complaint = complaintsRepository.findById(id)
					.orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

			// Set transient userId
			if (complaint.getUser() != null) {
				complaint.setUserId(complaint.getUser().getId());
			}
			System.out.println("complaint======>>" + complaint);
			List<EvidenceImageEntity> evidenceList = evidenceImageRepository.findByComplaints_Id(id);

			List<Map<String, String>> images = evidenceList.stream().map(ev -> {
				Map<String, String> map = new HashMap<>();
				map.put("fileName", ev.getFileName());
				map.put("fileType", ev.getContentType());
				map.put("data", Base64.getEncoder().encodeToString(ev.getContent()));
				return map;
			}).collect(Collectors.toList());

			model.addAttribute("logcomplaints", complaint);
			model.addAttribute("images", images);
			model.addAttribute("loggedUser", loggedUser);
			model.addAttribute("title", "View Complaint Details");

			return "polices/police-update-complaints";
		} catch (Exception e) {
			model.addAttribute("errorMessage", "Error fetching complaint details: " + e.getMessage());
			return "redirect:/onlinecrimereportingsystem/police/policeviewcomplaints";
		}
	}

	@PostMapping("/updatecomplaints")
	public String updateComplaints(@Valid @ModelAttribute("logcomplaints") ComplaintDTO complaintDTO,
			BindingResult errors, HttpSession session, Model model, RedirectAttributes redirectAttributes) {

		System.out.println("In post of updatess complaints");
		// Convert DTO to BO
		complaintDTO.setUpdatedAt(LocalDateTime.now());
		UserEntity user = userRepository.getUserById(complaintDTO.getUserId());
		System.out.println("complaintDTO===" + complaintDTO);
		if (user == null) {
			model.addAttribute("errorMessage", "USer Not Found!!");
			model.addAttribute("logcomplaints", complaintDTO);
			return "polices/police-update-complaints";

		}
		try {
			ComplaintEntity complaintEntity = complaintsRepository.findById(complaintDTO.getId()).orElseThrow(null);
			complaintEntity.setStatus(complaintDTO.getStatus());
			complaintEntity.setUpdatedAt(LocalDateTime.now());

			System.out.println("complaintEntity===at Update timeee===" + complaintEntity);

			if (complaintService.updateComplaints(complaintEntity) == null) {
				// session.setAttribute("message", new Message("Something Went Wrong!",
				// "alert-danger"));
				model.addAttribute("errorMessage", "Something Went Wrong!");
				model.addAttribute("logcomplaints", complaintDTO);

				return "polices/police-update-complaints";
			}

			model.addAttribute("logcomplaints", new ComplaintDTO());
			model.addAttribute("successMessage", "Complaint Update Successfully !!!");
			redirectAttributes.addFlashAttribute("successMessage", "Complaint Update Successfully !!!");

			return "redirect:/onlinecrimereportingsystem/police/policeviewcomplaints";
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("errorMessage", "Error:==" + e.getMessage());
			model.addAttribute("logcomplaints", complaintDTO);

			return "polices/police-update-complaints";

		}

	}

	@DeleteMapping("/deletecomplaints/{id}")
	@ResponseBody // Important: tells Spring to send raw response, not a view
	public ResponseEntity<String> deleteViewComplaints(@PathVariable("id") String id, HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
		if (loggedUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please log in first");
		}

		Long complaintId = Long.parseLong(id);
		boolean deleteStatus = complaintService.deleteComplaints(complaintId);

		if (deleteStatus) {
			return ResponseEntity.ok("Deleted successfully");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete");
		}
	}

	@GetMapping("/complaints/images/{id}")
	@ResponseBody
	public ResponseEntity<List<Map<String, String>>> getComplaintImages(@PathVariable Long id) {
		ComplaintEntity complaintEntity = complaintsRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

		List<EvidenceImageEntity> evidenceList = evidenceImageRepository.findByComplaints_Id(id);

		// Convert each image to Base64 string
		List<Map<String, String>> images = evidenceList.stream().map(ev -> {
			Map<String, String> map = new HashMap<>();
			map.put("fileName", ev.getFileName());
			map.put("fileType", ev.getContentType());
			map.put("data", Base64.getEncoder().encodeToString(ev.getContent()));
			return map;
		}).collect(Collectors.toList());

		return ResponseEntity.ok(images);
	}

	// PoliceOfficer Imagesssss
	@GetMapping("/policeofficer/image/{id}")
	@ResponseBody
	public ResponseEntity<byte[]> getPoliceImage(@PathVariable Long id) {

		System.out.println(" ID:=" + id);
		return userRepository.findById(id).map(police -> {
			System.out.println("police useer=" + police);
			byte[] image = police.getImage();
			String contentType = police.getContentType() != null ? police.getContentType() : "image/jpeg";
			System.out.println("image==" + image);
			return ResponseEntity.ok().header("Content-Type", contentType).body(image);
		}).orElse(ResponseEntity.notFound().build());
	}

	// Police Update the Complaints

	/*
	 * @GetMapping("/policelogin") public String policeDashboard(Model model) {
	 * 
	 * System.out.println("Police Login Pages goes from hereeeeee...");
	 * model.addAttribute("policeLoginDTO", new PoliceLoginDTO()); return
	 * "polices/police-login";
	 * 
	 * }
	 * 
	 * 
	 * 
	 * 
	 * @PostMapping("/policelogin") public String
	 * policeLogin(@Valid @ModelAttribute("policeLoginDTO") PoliceLoginDTO
	 * policeDTO, BindingResult errors, Model model, HttpSession session) {
	 * System.out.println("policeDTO===" + policeDTO);
	 * 
	 * if (errors.hasErrors()) {
	 * 
	 * model.addAttribute("errorMessage", "Some thing Went Wrong!!");
	 * model.addAttribute("policeLoginDTO", policeDTO); return
	 * "polices/police-login"; } PoliceOfficerBO policeLoginBO =
	 * policeLoginService.getPoliceOfficer(policeDTO.getEmail(),
	 * policeDTO.getContactNumber()); if (policeLoginBO != null) { if
	 * (policeLoginBO.getEmail().equals(policeDTO.getEmail()) &&
	 * policeLoginBO.getContactNumber().equals(policeDTO.getContactNumber())) {
	 * 
	 * model.addAttribute("successMessage", "Police Suucess Fully Login");
	 * model.addAttribute("policeLoginDTO", new PoliceLoginDTO());
	 * session.setAttribute("police", policeLoginBO); return
	 * "polices/police-dashboard"; } else { model.addAttribute("errorMessage",
	 * "Email Address and Conatct Number can Not Matched OR Invalide Police Officers Please Enter Correct Details !!!"
	 * ); model.addAttribute("policeLoginDTO", policeDTO); return
	 * "polices/police-dashboard";
	 * 
	 * }
	 * 
	 * } else { model.addAttribute("errorMessage", "Some thing Went Wrong!!");
	 * model.addAttribute("policeLoginDTO", policeDTO); return
	 * "polices/police-login";
	 * 
	 * }
	 * 
	 * }
	 */

	@GetMapping("/complaints/{id}/create-fir")
	public String showCreateFIRFromComplaint(@PathVariable("id") Long id, Model model, HttpSession session,
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
			ComplaintEntity complaint = complaintsRepository.findById(id)
					.orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));

complaint.setUserId(complaint.getUser().getId());
			
			ComplaintDTO complaintDTO=ComplaintDTO.of()
					.assignedOfficer(complaint.getAssignedOfficer())
					.createdAt(complaint.getCreatedAt())
					.crimeType(complaint.getCrimeType())
					.description(complaint.getDescription())
					//.evidenceImages(complaint.getEvidenceImages())
					.id(complaint.getId())
					.liveLocationLink(complaint.getLiveLocationLink())
					.location(complaint.getLocation())
					.policeStation(complaint.getPoliceStation())
					.status(complaint.getStatus())
					.title(complaint.getTitle())
					.username(complaint.getUsername())
					.userId(complaint.getUser().getId())
					.userEmail(complaint.getUserEmail())
					.user(complaint.getUser())
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

			// Initialize FIRDTO with complaint data and default values
			FIRDTO firDTO = new FIRDTO();
			firDTO.setId(null);
			firDTO.setComplaintId(complaint.getId());
			firDTO.setTitle(complaint.getTitle());
			firDTO.setDescription(complaint.getDescription());
			firDTO.setLocation(complaint.getLocation());
			firDTO.setCrimeType(complaint.getCrimeType());
			firDTO.setStatus("DRAFT");
			firDTO.setCreatedAt(complaint.getCreatedAt() != null ? complaint.getCreatedAt() : LocalDateTime.now());
			firDTO.setUpdatedAt(LocalDateTime.now()); // Use current time
			firDTO.setUserId(complaint.getUser() != null ? complaint.getUser().getId() : null);
			firDTO.setPoliceOfficerId(loggedOfficer.getId());
			firDTO.setIsUnderInvestigation(false);
			// Add attributes to the model

			System.out.println("complaint==" + complaint);
			System.out.println("loggedOfficer===" + loggedOfficer);
			System.out.println("firDTO==" + firDTO);

			model.addAttribute("logcomplaints", complaintDTO);
			model.addAttribute("loggedOfficer", loggedOfficer);
			model.addAttribute("fir", firDTO);
			model.addAttribute("title", "Create FIR from Complaint");
			return "polices/police-create-fir";
		} catch (Exception e) {
			model.addAttribute("errorMessage", "Error fetching complaint for FIR creation: " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage",
					"Error fetching complaint for FIR creation: " + e.getMessage());
			return "redirect:/onlinecrimereportingsystem/police/policeviewcomplaints";
		}
	}

	@PostMapping("/fir/create")
	public String createFIR(@Valid @ModelAttribute("fir") FIRDTO firDTO, BindingResult result, Model model,
			HttpSession session, RedirectAttributes redirectAttributes) {

		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
		System.out.println("firDTO===" + firDTO);
		ComplaintEntity complaint = complaintsRepository.findById(firDTO.getComplaintId())
				.orElseThrow(() -> new RuntimeException("Complaint not found"));
		PoliceOfficerBO policeOfficerBO = policeOfficerService.getPoliceOfficer(loggedUser.getSecretKey());
		PoliceOfficerDTO loggedOfficer = PoliceOfficerDTO.of()
				.assignedComplaints(policeOfficerBO.getAssignedComplaints())
				.badgeNumber(policeOfficerBO.getBadgeNumber()).contactNumber(policeOfficerBO.getContactNumber())
				.contentType(policeOfficerBO.getContentType()).email(policeOfficerBO.getEmail())
				.filename(policeOfficerBO.getFilename()).id(policeOfficerBO.getId())
				.policeStation(policeOfficerBO.getPoliceStation())
				.policeStationselect(policeOfficerBO.getPoliceStationselect()).rank(policeOfficerBO.getRank()).build();
		try {

			if (result.hasErrors()) {

				System.out.println("Field Error:==" + result.toString());
				System.out.println("complaint==" + complaint);
				System.out.println("loggedOfficer===" + loggedOfficer);
				System.out.println("firDTO==" + firDTO);
				model.addAttribute("logcomplaints", complaint);
				model.addAttribute("loggedOfficer", loggedOfficer);
				model.addAttribute("fir", firDTO);
				redirectAttributes.addFlashAttribute("loggedUser", loggedUser);
				model.addAttribute("title", "Create FIR from Complaint");
				return "polices/police-create-fir";
			}

			// Check for existing FIR with the same complaintId
			Optional<FIREntity> existingFIR = firRepository.findByComplaintId(firDTO.getComplaintId());
			if (existingFIR.isPresent()) {
				redirectAttributes.addFlashAttribute("errorMessage",
						"An FIR already exists for this complaint. Only one FIR per complaint is allowed.");
				model.addAttribute("errorMessage",
						"An FIR already exists for this complaint. Only one FIR per complaint is allowed.");
				System.out.println("An FIR already exists for this complaint. Only one FIR per complaint is allowed.");
				System.out.println("complaint==" + complaint);
				System.out.println("loggedOfficer===" + loggedOfficer);
				System.out.println("firDTO==" + firDTO);
				System.out.println("loggedUser=="+loggedUser);
				redirectAttributes.addFlashAttribute("loggedUser", loggedUser);

				model.addAttribute("logcomplaints", complaint);
				model.addAttribute("loggedOfficer", loggedOfficer);
				model.addAttribute("fir", firDTO);
				model.addAttribute("title", "Create FIR from Complaint");
				return "redirect:/onlinecrimereportingsystem/police/policeviewcomplaints";
			}

			// Map FIRDTO to FIREntity
			FIREntity fir = new FIREntity();
			fir.setFirNumber(firDTO.getFirNumber());
			fir.setTitle(firDTO.getTitle());
			fir.setDescription(firDTO.getDescription());
			fir.setLocation(firDTO.getLocation());
			fir.setCrimeType(firDTO.getCrimeType());
			fir.setStatus(firDTO.getStatus());
			fir.setCreatedAt(firDTO.getCreatedAt() != null ? firDTO.getCreatedAt() : LocalDateTime.now());
			fir.setUpdatedAt(firDTO.getUpdatedAt() != null ? firDTO.getUpdatedAt() : LocalDateTime.now());
			fir.setCaseOfficerNotes(firDTO.getCaseOfficerNotes());
			fir.setIsUnderInvestigation(firDTO.isUnderInvestigation());

			// Set relationships
			UserEntity user = userRepository.findById(firDTO.getUserId())
					.orElseThrow(() -> new RuntimeException("User not found"));
			PoliceOfficerEntity policeOfficer = policeOfficerRepository.findById(firDTO.getPoliceOfficerId())
					.orElseThrow(() -> new RuntimeException("Police officer not found"));
			ComplaintEntity complaints = complaintsRepository.findById(firDTO.getComplaintId())
					.orElseThrow(() -> new RuntimeException("Complaint not found"));
			fir.setUser(user);
			fir.setPoliceOfficer(policeOfficer);
			fir.setComplaint(complaints);
			System.out.println("fir==" + fir);

			// Save to database
			firRepository.save(fir);
			System.out.println("Successfull Adedd FIRs........");
			redirectAttributes.addFlashAttribute("loggedUser", loggedUser);
			redirectAttributes.addFlashAttribute("successMessage", "FIR created successfully!");
			return "redirect:/onlinecrimereportingsystem/police/policeviewcomplaints";
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("complaint==" + complaint);
			System.out.println("loggedOfficer===" + loggedOfficer);
			System.out.println("firDTO==" + firDTO);
			System.out.println("loggedUser=="+loggedUser);

			System.out.println("Rror MEssage:==" + e.getMessage());
			model.addAttribute("errorMessage", "Error creating FIR: " + e.getMessage());
			redirectAttributes.addFlashAttribute("errorMessage", "Error creating FIR: " + e.getMessage());
			redirectAttributes.addFlashAttribute("loggedUser", loggedUser);
			redirectAttributes.addFlashAttribute("logcomplaints", complaint);
			redirectAttributes.addFlashAttribute("fir", firDTO);
			return "polices/police-create-fir";
		}
	}
	
	
	
	
	
	
	
	

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication
				.run(com.springboot.onlinereporting.system.SpringBootOnlineCrimeReportingSystemApplication.class, args);

		UserRepository repo = context.getBean(UserRepository.class);

		UserEntity entity = repo.getUserById(602L);
		System.out.println("entity==" + entity);

		if (entity != null) {
			byte[] image = entity.getImage();
			System.out.println("image bytes length==" + (image == null ? "null" : image.length));
			String contentType = entity.getContentType() != null ? entity.getContentType() : "image/jpeg";
			System.out.println("contentType==" + contentType);
			System.out.println("image==" + Arrays.toString(image));
		} else {
			System.out.println("No user found with id 602");
		}

	}

}
