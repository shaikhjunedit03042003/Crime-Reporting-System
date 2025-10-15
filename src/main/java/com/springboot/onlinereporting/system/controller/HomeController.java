package com.springboot.onlinereporting.system.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.BO.UserBO;
import com.springboot.onlinereporting.system.DTO.LoginUserDTO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.DTO.UserDTO;
import com.springboot.onlinereporting.system.entities.CrimeTypedEntity;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.helper.Message;
import com.springboot.onlinereporting.system.repositories.CrimeTypeRepository;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;
import com.springboot.onlinereporting.system.services.UserService;
import com.springboot.onlinereporting.system.springsecurity.service.JWTService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/onlinecrimereportingsystem")
public class HomeController {

	@Autowired
	private JWTService jwtService;
	@Value("${admin.secret.key}") // Define in application.properties
	private String adminSecretKey;

	@Autowired
	private UserService userService;
	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private PoliceOfficerService policeOfficerService;

	@Autowired
	private PoliceOfficerRepository policeOfficerRepository;
	
	@Autowired
	private CrimeTypeRepository crimeTypeRepository;

	// Home Handler

	@GetMapping({ "", "/", "/home" })
	public String home(Model model) {
		model.addAttribute("title", "Home - Online Crime ReportingSystem");
		return "home";
	}
	// Login Handler

	@GetMapping("/login")
	public String loginPage(Model model, @RequestParam(value = "error", required = false) String error,
			@RequestParam(value = "logout", required = false) String logout) {
		model.addAttribute("user", new LoginUserDTO());
		if (error != null) {
			model.addAttribute("errorMessage", "Invalid username or password!");
		}
		if (logout != null) {
			model.addAttribute("successMessage", "You have been logged out successfully.");
		}
		return "login";
	}

	// do lohgin

	@GetMapping("/myhome")
	public String myHome(@CookieValue("jwt") String token, Model model) {
		System.out.println("Token==" + token);
		return "my-home";
	}

	// About Handler
	@GetMapping("/about")
	public String about(Model model) {
		model.addAttribute("title", "About - Online Crime ReportingSystem");
		return "about";
	}

	// Sigup handler
	@GetMapping("/signup")
	public String signup(Model model, HttpSession session,HttpServletRequest request) {
		model.addAttribute("user", new UserDTO());
		model.addAttribute("title", "SignUp- Online Crime Reporting System");
		session.removeAttribute("message");
		return "signup";
	}

	// Do Register Handler

	@PostMapping("/do_register")
	public String doregister(@Valid @ModelAttribute("user") UserDTO userDTO, BindingResult error,
			@RequestParam(value = "image", required = false) MultipartFile image,
			@RequestParam(value = "agreement", defaultValue = "false") boolean agreement,
			@RequestParam(value = "secretKey", required = false) String secretKey,
			@RequestParam(value = "secretKeypolice", required = false) String secretKeyPolice, Model model,
			HttpSession session) {

		System.out.println("image==" + image);
		System.out.println("secretKey==" + secretKey);
		System.out.println("secretKeyPolice==" + secretKeyPolice);
		try {
			if (!agreement) {
				System.out.println("You have not agreed to the terms and conditions!");
				session.setAttribute("message",
						new Message("You have not agreed the terms and conditions!", "alert-danger"));
				model.addAttribute("errorMessage", "You have not agreed the terms and conditions!");
				model.addAttribute("user", userDTO);
				return "signup";
			}

			// Handle image upload
			byte[] imageBytes = null;
			if (image != null && !image.isEmpty()) {
				if (!image.getContentType().startsWith("image/")) {
					model.addAttribute("errorMessage", "Only image files are allowed");

					model.addAttribute("user", userDTO);
					return "signup";
				}
				imageBytes = image.getBytes();
			} else {
				session.setAttribute("message", new Message("Please select an image to upload", "alert-danger"));
				model.addAttribute("user", userDTO);
				return "signup";
			}

			if (error.hasErrors()) {
				System.out.println("Validation errors for other fields");
				System.out.println("Error: " + error.toString());
				model.addAttribute("user", userDTO);
				return "signup";
			}

			if ("ADMIN".equals(userDTO.getRole())) {
				if (secretKey == null || !secretKey.equals(adminSecretKey)) {
					error.rejectValue("secretKey", "error.secretKey", "Invalid admin secret key");
					session.setAttribute("message", new Message("Invalid admin secret key", "alert-danger"));
					model.addAttribute("errorMessage", "Invalid admin secret key");
					model.addAttribute("user", userDTO);
					return "signup";
				}
			} else if ("POLICE".equals(userDTO.getRole())) {
				System.out.println("!policeOfficerRepository.existsByBadgeNumber(secretKey)"
						+ (!policeOfficerRepository.existsByBadgeNumber(secretKeyPolice)));
				if (secretKeyPolice == null || !policeOfficerRepository.existsByBadgeNumber(secretKeyPolice)) {
					model.addAttribute("errorMessage",
							"Invalid Police BadgeNumber Please Correct BadgeNumber Enter...");
					model.addAttribute("user", userDTO);
					return "signup";
				}
			}

			String encodedPassword = encoder.encode(userDTO.getPassword());

			// Convert DTO -> BO (Business Object)
			UserBO userBO = new UserBO();
			userBO.setUsername(userDTO.getUsername());
			userBO.setEmailid(userDTO.getEmailid());
			userBO.setPassword(userDTO.getPassword());
			userBO.setPassword(encodedPassword);
			userBO.setRole(userDTO.getRole());
			userBO.setMessage(userDTO.getMessage());
			userBO.setAgreement(agreement);
			if (secretKey.isEmpty() || secretKey == null) {
				userBO.setSecretKey(secretKeyPolice);
			} else {
				userBO.setSecretKey(secretKey);
			}
			userBO.setImage(imageBytes);
			userBO.setFilename(image.getName());
			userBO.setContentType(image.getContentType());

			Optional<UserEntity> existingUser = userService.getUserByUsername(userBO.getEmailid());

			if (existingUser.isPresent()) {
				model.addAttribute("errorMessage", "User Already Exists in the System");
				model.addAttribute("user", userDTO);
				return "signup";
			}

			// Convert BO -> Entity and save
			UserEntity userEntity = new UserEntity();
			userEntity.setUsername(userBO.getUsername());
			userEntity.setEmailid(userBO.getEmailid());
			userEntity.setPassword(userBO.getPassword());
			userEntity.setRole(userBO.getRole());
			userEntity.setMessage(userBO.getMessage());
			userEntity.setAgreement(userBO.isAgreement());
			userEntity.setSecretKey(userBO.getSecretKey());
			userEntity.setImage(userBO.getImage());
			userEntity.setFilename(userBO.getFilename());
			userEntity.setContentType(userBO.getContentType());

			UserEntity savedUser = userService.saveUsers(userEntity);
			System.out.println("User saved: " + savedUser);

			model.addAttribute("user", new UserDTO()); // reset form
			session.setAttribute("message", new Message("Successfully Registered!", "alert-success"));
			model.addAttribute("successMessage", "Successfully Registered!");
			return "signup";

		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("user", new UserDTO());
			model.addAttribute("errorMessage", "Something went wrong: " + e.getMessage());
			session.setAttribute("message", new Message("Something went wrong: " + e.getMessage(), "alert-danger"));
			return "signup";
		}
	}

	/*
	 * @PostMapping("/login") public String dologin(@Valid @ModelAttribute("user")
	 * LoginUserDTO user, BindingResult error, Model model, HttpSession session) {
	 * UserEntity userEntity = null; System.out.println("user:=" + user);
	 * 
	 * if (error.hasErrors()) { System.out.println("Error: " + error.toString());
	 * model.addAttribute("user", user); return "login"; }
	 * 
	 * userEntity = userService.getUserByUsername(user.getEmailid()).get();
	 * System.out.println("=======================================");
	 * 
	 * System.out.println("userEntity:==" + userEntity);
	 * System.out.println("=======================================");
	 * 
	 * if (userEntity == null) { model.addAttribute("user", new UserDTO());
	 * model.addAttribute("successMessage", "Invalid Username and Password");
	 * session.setAttribute("message", new Message("Invalid Username and Password",
	 * "alert-danger")); model.addAttribute("title",
	 * "Login - Online Crime Reporting System");
	 * 
	 * return "login"; } else if
	 * (userEntity.getPassword().equals(user.getPassword()) &&
	 * "USER".equals(userEntity.getRole())) { model.addAttribute("title",
	 * "User Dashboard - Online Crime Reporting System");
	 * session.setAttribute("loggedUser", userEntity); return
	 * "users/user-dashboard"; } else if
	 * (userEntity.getPassword().equals(user.getPassword()) &&
	 * "ADMIN".equals(userEntity.getRole())) { model.addAttribute("title",
	 * "Admin Dashboard - Online Crime Reporting System");
	 * session.setAttribute("loggedAdmin", userEntity); return
	 * "admin/admin-dashboard"; } else { model.addAttribute("user", new UserDTO());
	 * model.addAttribute("title", "Login - Online Crime Reporting System");
	 * session.setAttribute("message", new
	 * Message("Invalide Username and Password and User not Exit in the System",
	 * "alert-danger")); model.addAttribute("errorMessage",
	 * "Invalide Username and Password and User not Exit in the System"); return
	 * "login"; } }
	 */

	// User Dashboard

	// logout
	@GetMapping("/logout")
	public String logout(Model model, HttpSession session) {
		model.addAttribute("user", new LoginUserDTO());
		session.setAttribute("message", new Message("User Logout", "alert-danger"));
		model.addAttribute("successMessage", "User Logout");
		return "login";
	}

	@GetMapping("/allpoliceofficers-contact-us")
	public String getAllPoliceOfficer(Model model) {
		List<PoliceOfficerDTO> policeOfficerDTOs = policeOfficerService.getAllPoliceOfficers();
		System.out.println("all Police gettin gor All policeOfficerDTOs==" + policeOfficerDTOs);
		try {
			if (policeOfficerDTOs != null) {
				model.addAttribute("policeOfficerDTOs", policeOfficerDTOs);
				return "contact-us";

			} else {
				model.addAttribute("errorMessage", "Police Officers NOT FOund!");
				return "contact-us";

			}
		} catch (Exception e) {
			model.addAttribute("errorMessage", "Error:=" + e.getMessage());

			return "contact-us";

		}

	}

	@GetMapping("/allpoliceofficers-contact-us/image/{id}")
	@ResponseBody
	public ResponseEntity<byte[]> getPoliceImage(@PathVariable Long id) {

		System.out.println(" ID:=" + id);
		return policeOfficerRepository.findById(id).map(police -> {
			byte[] image = police.getImgaes();
			String contentType = police.getContentType() != null ? police.getContentType() : "image/jpeg";
			System.out.println("Police images  image==" + image);
			return ResponseEntity.ok().header("Content-Type", contentType).body(image);
		}).orElse(ResponseEntity.notFound().build());
	}
	
	@GetMapping("/display-crime")
	public String displayCrimes(Model model) {
		List<CrimeTypedEntity> crimeTypes = crimeTypeRepository.findAll();
		model.addAttribute("crimeTypes", crimeTypes);
		model.addAttribute("title", "Display Crime Types");
		return "display-crime";
	}
	
}
