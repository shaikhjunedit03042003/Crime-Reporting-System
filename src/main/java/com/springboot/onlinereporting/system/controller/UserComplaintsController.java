package com.springboot.onlinereporting.system.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.BO.ComplaintBO;
import com.springboot.onlinereporting.system.BO.UserBO;
import com.springboot.onlinereporting.system.DTO.ComplaintDTO;
import com.springboot.onlinereporting.system.DTO.UserDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.helper.Message;
import com.springboot.onlinereporting.system.mapper.ComplaintsMapper;
import com.springboot.onlinereporting.system.repositories.UserRepository;
import com.springboot.onlinereporting.system.services.ComplaintServce;
import com.springboot.onlinereporting.system.services.CrimeTypedService;
import com.springboot.onlinereporting.system.services.LocationServce;
import com.springboot.onlinereporting.system.services.PoliceStationEntryService;
import com.springboot.onlinereporting.system.services.UserService;
import com.springboot.onlinereporting.system.springsecurity.principal.UserPrincipal;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/onlinecrimereportingsystem/users")
public class UserComplaintsController {
	@Autowired
	private ComplaintsMapper complaintsMapper;
	@Autowired
	private LocationServce locationServce;

	@Autowired
	private ComplaintServce complaintServce;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CrimeTypedService crimeTypedService;
	@Autowired
	private PoliceStationEntryService policeStationEntryService;

	@Autowired
	private UserService userService;

	// user home controller
	@GetMapping({ "", "/dashboard", "/userhome" })
	public String userHome(Model model) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated()) {
			// userDetails is your UserPrincipal
			UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
			UserEntity loggedUser = userPrincipal.getUser(); // expose getUser() in UserPrincipal

			model.addAttribute("loggedUser", loggedUser);
		}
		model.addAttribute("title", "User Dashboard - Online Crime Reporting System");
		return "users/user-dashboard";
	}

	// gettingbthe User Dashboard

	@GetMapping("/user-dashboard")
	public String userDashboard() {
		return "user-dashboard";
	}

	@GetMapping("/logcomplaints")
	public String logComplaints(Model model) {
		UserEntity loggedUser=null;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated()) {
			// userDetails is your UserPrincipal
			UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
			loggedUser = userPrincipal.getUser(); // expose getUser() in UserPrincipal

			model.addAttribute("loggedUser", loggedUser);
		}
		System.out.println("loggedUser=="+loggedUser);
		if (loggedUser == null) {
			//session.setAttribute("message", new Message("Please login first", "alert-danger"));
			model.addAttribute("errorMessage", "Please login first");
			return "redirect:/onlinecrimereportingsystem/login";
		}
		ComplaintDTO complaintDTO = new ComplaintDTO();
		complaintDTO.setUserId(loggedUser.getId());
		complaintDTO.setUserEmail(loggedUser.getEmailid());
		complaintDTO.setUsername(loggedUser.getUsername());
		model.addAttribute("logcomplaints", complaintDTO);
		return "users/log-complaints";
	}

	@PostMapping("/logcomplaints")
	public String logComplaintssave(@Valid @ModelAttribute("logcomplaints") ComplaintDTO complaintDTO,
			BindingResult errors, HttpSession session, Model model) {

		System.out.println("In post of log complaints");
		System.out.println("complaintDTO===" + complaintDTO);

		if (errors.hasErrors()) {
			System.out.println("Error in isde opost of log complaints:==" + errors.toString());
			model.addAttribute("logcomplaints", complaintDTO);
			model.addAttribute("errorMessage", "Some thing Went Wrong");
			return "users/log-complaints";

		}

		UserEntity user = userRepository.getUserById(complaintDTO.getUserId());
		if (user == null) {
			session.setAttribute("message", new Message("User not Found !!", "alert-danger"));
			model.addAttribute("errorMessage", "User not Found !!");
			return "users/log-complaints";

		}

		// Convert DTO to BO
		ComplaintBO complaintBO = new ComplaintBO();
		complaintBO.setUserId(complaintDTO.getUserId());
		complaintBO.setUser(user);
		complaintBO.setUsername(complaintDTO.getUsername());
		complaintBO.setTitle(complaintDTO.getTitle());
		complaintBO.setDescription(complaintDTO.getDescription());
		complaintBO.setStatus(complaintDTO.getStatus());
		complaintBO.setCreatedAt(LocalDateTime.now());
		complaintBO.setUpdatedAt(LocalDateTime.now());
		complaintBO.setCrimeType(complaintDTO.getCrimeType());
		complaintBO.setLocation(complaintDTO.getLocation());
		complaintBO.setUserEmail(complaintDTO.getUserEmail());
		complaintBO.setLiveLocationLink(complaintDTO.getLiveLocationLink());
		complaintBO.setPoliceStation(complaintDTO.getPoliceStation());
		complaintBO.setEvidenceImages(complaintDTO.getEvidenceImages());

		// Save complaint and images

		// Call service layer to save and get saved DTO
		try {
			ComplaintDTO savedComplaintDTO = complaintServce.saveComplaint(complaintBO);

			// Verify save by checking the returned DTO
			if (savedComplaintDTO != null && savedComplaintDTO.getId() != null) {

				model.addAttribute("successMessage",
						"Complaint logged successfully with ID: " + savedComplaintDTO.getId());
				return "users/log-complaints";
			} else {
				model.addAttribute("errorMessage", "Failed to log complaint: Save operation returned null.");
				return "redirect:/onlinecrimereportingsystem/users/logcomplaints";
			}
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("errorMessage", "Failed to log complaint: Error Message." + e.getMessage());
			return "redirect:/onlinecrimereportingsystem/users/logcomplaints";

		}

	}

	@PostMapping("/save-location")
	@ResponseBody
	public String saveLocation(@RequestParam double latitude, @RequestParam double longitude) {
		String link = "https://www.google.com/maps?q=" + latitude + "," + longitude;
		System.out.println("link==" + link);
		com.springboot.onlinereporting.system.entities.Location loc = new com.springboot.onlinereporting.system.entities.Location();
		loc.setLatitude(latitude);
		loc.setLongitude(longitude);
		loc.setMapsLink(link);

		locationServce.saveLocation(loc);

		return link;
	}

	// Views All Complaints

	@GetMapping("/viewallcomplaints")
	public String viewAllComplaints(Model model, HttpSession session) {
		System.out.println("View all controller");
		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
		System.out.println("loggedUser==" + loggedUser);

		if (loggedUser == null) {
			// session.setAttribute("message", new Message("Please log in first",
			// "alert-danger"));
			model.addAttribute("errorMessage", "Please log in first");
			return "redirect:/onlinecrimereportingsystem/login";
		}

		System.out.println("loggedUser ID==" + loggedUser.getId());

		System.out.println("================================8888888888888888888888");

		List<ComplaintDTO> complaintDTO = complaintServce.getAllComplaints(loggedUser.getId(), loggedUser.getEmailid());
		System.out.println("complaintDTO:===" + complaintDTO);
		model.addAttribute("complaintDTOs", complaintDTO);
		return "users/view-all-complaints";
	}

	@GetMapping("/updatecomplaints/{id}")
	public String updateViewComplaints(@PathVariable("id") String id, Model model, HttpSession session) {
		System.out.println("Complaints id:=" + id);
		Long complaintId = Long.parseLong(id);
		System.out.println("View all controller");
		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
		System.out.println("loggedUser==" + loggedUser);

		if (loggedUser == null) {
			model.addAttribute("errorMessage", "Please log in first");
			return "redirect:/onlinecrimereportingsystem/login";
		}

		System.out.println("loggedUser ID==" + loggedUser.getId());

		System.out.println("=update complaites hereeeee");

		ComplaintDTO complaintDTO = complaintServce.getComplaint(complaintId, loggedUser.getId(),
				loggedUser.getEmailid());
		complaintDTO.setUserId(loggedUser.getId());

		System.out.println("complaintDTO:===" + complaintDTO);
		model.addAttribute("logcomplaints", complaintDTO);
		model.addAttribute("title", "Update Complaint");

		return "users/update-complaints";
	}

	@PutMapping("/updatecomplaints")
	public String updateComplaints(@Valid @ModelAttribute("logcomplaints") ComplaintDTO complaintDTO,
			BindingResult errors, HttpSession session, Model model) {

		System.out.println("In post of updatess complaints");
		// Convert DTO to BO
		UserEntity user = userRepository.getUserById(complaintDTO.getUserId());
		System.out.println("complaintDTO===" + complaintDTO);
		if (user == null) {
			model.addAttribute("errorMessage", "USer Not Found!!");
			return "users/log-complaints";

		}
		ComplaintBO complaintBO = complaintsMapper.toBo(complaintDTO);
		complaintBO.setUser(user);

		if (errors.hasErrors()) {
			System.out.println("Error in isde opost of log complaints:==" + errors.toString());
			model.addAttribute("logcomplaints", complaintDTO);

			return "users/update-complaints";

		}

		// Convert BO to Entity
		ComplaintEntity complaintEntity = complaintsMapper.toEntity(complaintBO);
		System.out.println("complaintEntity===at Update timeee===" + complaintEntity);

		if (complaintServce.updateComplaints(complaintEntity) == null) {
			// session.setAttribute("message", new Message("Something Went Wrong!",
			// "alert-danger"));
			model.addAttribute("errorMessage", "Something Went Wrong!");
			return "users/update-complaints";
		}

		model.addAttribute("logcomplaints", new ComplaintDTO());
		model.addAttribute("successMessage", "Complaint Update Successfully !!!");

		return "users/update-complaints";

	}

	@DeleteMapping("/deletecomplaints/{id}")
	@ResponseBody // Important: tells Spring to send raw response, not a view
	public ResponseEntity<String> deleteViewComplaints(@PathVariable("id") String id, HttpSession session) {
		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
		if (loggedUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please log in first");
		}

		Long complaintId = Long.parseLong(id);
		boolean deleteStatus = complaintServce.deleteComplaints(complaintId);

		if (deleteStatus) {
			return ResponseEntity.ok("Deleted successfully");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete");
		}
	}

	// My Account

	@GetMapping("/myaccount")
	public String myAccount(Model model) {
		UserEntity user = null;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.isAuthenticated()) {
			// userDetails is your UserPrincipal
			UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
			user = userPrincipal.getUser(); // expose getUser() in UserPrincipal

			model.addAttribute("loggedUser", user);
		}
		// UserEntity user = (UserEntity) session.getAttribute("loggedUser");
		System.out.println("user in my account==" + user);
		if (user != null) {
			UserDTO userDTO = UserDTO.of().agreement(user.isAgreement()).emailid(user.getEmailid()).id(user.getId())
					.message(user.getMessage()).username(user.getUsername()).build();
			model.addAttribute("userDTO", userDTO);
			return "users/my-account";
		}
		System.out.println("user:=" + user);
		model.addAttribute("errorMessage", "Please Login First!!");
		return "login";
	}

	// update My Accounttt
	@PostMapping("/updateuser/{id}")
	public String doregister(@PathVariable("id") Long id, @Valid @ModelAttribute("user") UserDTO userDTO,
			BindingResult error, @RequestParam(value = "image", required = false) MultipartFile image, Model model,
			HttpSession session) {

		System.out.println("image==" + image);
		System.out.println("id==" + id);
		System.out.println("userDTO==" + userDTO);
		/*
		 * if (error.hasErrors()) {
		 * System.out.println("Validation errors for other fields");
		 * System.out.println("Error: " + error.toString()); model.addAttribute("user",
		 * userDTO); return "signup"; }
		 */
		try {

			// Handle image upload
			byte[] imageBytes = null;
			if (image != null && !image.isEmpty()) {
				if (!image.getContentType().startsWith("image/")) {
					model.addAttribute("errorMessage", "Only image files are allowed");

					model.addAttribute("userDTO", userDTO);
					return "users/my-account";
				}
				imageBytes = image.getBytes();
			} else {
				session.setAttribute("message", new Message("Please select an image to upload", "alert-danger"));
				model.addAttribute("userDTO", userDTO);
				return "users/my-account";
			}

			/*
			 * BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12); String
			 * encodedPassword = encoder.encode(userDTO.getPassword());
			 * userDTO.setPassword(encodedPassword);
			 */
			// Convert DTO -> BO (Business Object)
			UserBO userBO = new UserBO();
			userBO.setId(id);
			userBO.setUsername(userDTO.getUsername());
			userBO.setEmailid(userDTO.getEmailid());

			userBO.setMessage(userDTO.getMessage());

			userBO.setImage(imageBytes);
			userBO.setFilename(image.getName());
			userBO.setContentType(image.getContentType());

			// Convert BO -> Entity and save
			UserEntity userEntity = new UserEntity();
			userEntity.setId(id);
			userEntity.setUsername(userBO.getUsername());
			userEntity.setEmailid(userBO.getEmailid());
			userEntity.setMessage(userBO.getMessage());
			userEntity.setImage(userBO.getImage());
			userEntity.setFilename(userBO.getFilename());
			userEntity.setContentType(userBO.getContentType());

			UserBO savedUser = userService.updateUser(userEntity);
			System.out.println("User saved: update after " + savedUser);
			UserDTO usetDto = UserDTO.of().agreement(savedUser.isAgreement()).contentType(savedUser.getContentType())
					.emailid(savedUser.getEmailid()).filename(savedUser.getFilename()).id(savedUser.getId())
					// .image(savedUser.getImage())
					.message(savedUser.getMessage()).username(savedUser.getUsername())

					.build();

			model.addAttribute("userDTO", usetDto); // reset form
			session.setAttribute("message", new Message("Successfully Update Usersss!", "alert-success"));
			model.addAttribute("successMessage", "Successfully Updated!");
			return "users/my-account";

		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("userDTO", new UserDTO());
			model.addAttribute("errorMessage", "Something went wrong: " + e.getMessage());
			session.setAttribute("message", new Message("Something went wrong: " + e.getMessage(), "alert-danger"));
			return "users/my-account";
		}
	}

	// getting image form data based hereeee
	@GetMapping("/image/{id}")
	@ResponseBody
	public ResponseEntity<byte[]> getUserImage(@PathVariable Long id) {

		System.out.println(" ID:=" + id);
		return userRepository.findById(id).map(user -> {
			byte[] image = user.getImage();
			String contentType = user.getContentType() != null ? user.getContentType() : "image/jpeg";

			return ResponseEntity.ok().header("Content-Type", contentType).body(image);
		}).orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/allcrimetypes")
	@ResponseBody
	public ResponseEntity<Map<Long, String>> getAllCrimeTypes() {
		Map<Long, String> allTypes = crimeTypedService.getAllCrimeTypes();
		System.out.println("All typedcrimeeeddd=" + allTypes);
		return ResponseEntity.ok(allTypes != null ? allTypes : Collections.emptyMap());
	}

	@GetMapping("/allpolicestation")
	@ResponseBody
	public ResponseEntity<Map<String, String>> getAllPoiceStation() {
		Map<String, String> allPoliceStation = policeStationEntryService.getAllPoliceStation();

		System.out.println("allPoliceStation==" + allPoliceStation);
		return ResponseEntity.ok(allPoliceStation != null ? allPoliceStation : Collections.emptyMap());
	}

}
