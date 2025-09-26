package com.springboot.onlinereporting.system.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.springboot.onlinereporting.system.BO.ComplaintBO;
import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.PoliceOfficerEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.repositories.UserRepository;
import com.springboot.onlinereporting.system.services.ComplaintServce;
import com.springboot.onlinereporting.system.services.PoliceLoginService;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;
import com.springboot.onlinereporting.system.springsecurity.principal.UserPrincipal;

import jakarta.servlet.http.HttpSession;

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
	private  PoliceOfficerRepository policeOfficerRepository;

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

					List<ComplaintBO> complaints = complaintService
							.getComplaintsByPoliceStation(policeOfficerBO.getPoliceStationselect());

					System.out.println("BO Compalints complaints" + complaints);
					List<ComplaintDTO> complaintDTOs = complaints.stream()
							.map(complaint -> ComplaintDTO.of().id(complaint.getId()).userId(complaint.getUserId())
									.username(complaint.getUsername()).status(complaint.getStatus())
									.createdAt(complaint.getCreatedAt()).title(complaint.getTitle())

									.build())
							.collect(Collectors.toList());
					System.out.println("complaintDTOs==" + complaintDTOs);
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

	//  Complaint update  Page Viewss

	@GetMapping("/updatecomplaints/{id}")
	public String updateViewComplaints(@PathVariable("id") String id, Model model, HttpSession session) {
		System.out.println("Complaints id:=" + id);
		Long complaintId = Long.parseLong(id);
		System.out.println("View  controller of the UserComplaint by Police");

		try {
			UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
			System.out.println("loggedUser==" + loggedUser);

			if (loggedUser == null) {
				model.addAttribute("errorMessage", "Please log in first");
				return "redirect:/onlinecrimereportingsystem/login";
			}

			System.out.println("loggedUser ID==" + loggedUser.getId());

			System.out.println("=update complaites hereeeee");

			ComplaintDTO complaintDTO = policeOfficerService.findComplaintById(complaintId);
			if (complaintDTO != null) {

				System.out.println("complaintDTO:===" + complaintDTO);
				model.addAttribute("logcomplaints", complaintDTO);
				model.addAttribute("loggedUser", loggedUser);
				model.addAttribute("title", "Update Complaint");
				return "polices/police-update-complaints";
			}

			model.addAttribute("errorMessage", "Some thing Went Wrong to Update the Complaints");
			return "polices/police-views-all-complaints";
		} catch (Exception e) {
			model.addAttribute("errorMessage",
					"Some thing Went Wrong to Update the Complaints Error:=" + e.getMessage());
			return "polices/police-views-all-complaints";

		}

	}
	
	
	//Police Update the Complaints 
	
	
	
	
	

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
