package com.springboot.onlinereporting.system.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.springboot.onlinereporting.system.DTO.UserDTO;
import com.springboot.onlinereporting.system.emails.OTPGenerator;
import com.springboot.onlinereporting.system.emails.SendEmail;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.helper.Message;
import com.springboot.onlinereporting.system.repositories.UserRepository;
import com.springboot.onlinereporting.system.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/onlinecrimereportingsystem/forgotpassword")
public class ForgotController {

	@Autowired
	private UserService userService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder encoder;

	@GetMapping("/forgot")
	public String openEmail() {

		return "forgot-openEmail-form";
	}

	@PostMapping("/forgot")
	public String varifyEmail(@RequestParam("emailid") String email, HttpSession session, Model model) {
		System.out.println("emaild id: " + email);
		UserEntity existingUser = userRepository.findByEmailid(email).orElse(null);
		if (existingUser != null) {

			OTPGenerator otpGenerator = new OTPGenerator();
			int otp = otpGenerator.optGenerate();
			SendEmail sendEmail = new SendEmail();
			String subject = "OTP From Online Crime Reporting System";
			String to = email;
			String message = "<div style='border:1px solid #2e2e2;padding:20px'>" + "OTP    " + "<b>" + otp + "</div>";
			boolean status = sendEmail.sendEmail(to, subject, message);
			System.out.println("Come here testingggg case status: " + status);

			if (status) {
				session.setAttribute("successMessage",
						new Message("We have Sent OTP to you Email....", "alert-success"));

				model.addAttribute("successMessage", "We have Sent OTP to you Email....");
				session.setAttribute("myOTP", otp);
				session.setAttribute("myEmail", email);
				return "verify-otp";
			} else {
				session.setAttribute("successMessage",
						new Message("Oops Some thing Wrong Please Check yourEmail id", "alert-danger"));
				model.addAttribute("successMessage",
						new Message("Oops Some thing Wrong Please Check yourEmail id", "alert-danger"));
				return "forgot-openEmail-form";
			}
		} else {
			session.setAttribute("errorMessage",
					new Message("Oops Some thing Wrong Please Check yourEmail id", "alert-danger"));
			model.addAttribute("errorMessage", "User not found with EmailId " + email+"  in the System");
			return "forgot-openEmail-form";

		}

	}

	// Verify OTP

	@PostMapping("/verify-otp")
	public String verifyOTP(@RequestParam("otp") int otp, HttpSession session, Model model) {
		int myOTP = (int) session.getAttribute("myOTP");
		String emailid = (String) session.getAttribute("myEmail");
		System.out.println("session email id=" + emailid);

		System.out.println("myopt==" + myOTP);
		System.out.println("otp==" + otp);
		if (myOTP == otp) {
			model.addAttribute("successMessage", "Valid OTP !!!");
			session.setAttribute("message", new Message("Valid OTP", "alert-success"));
			UserEntity user = userService.getUserByUsername(emailid).get();
			System.out.println("User database email id=" + emailid);
			if (user == null) {
				// Error
				model.addAttribute("errorMessage", "User does not Exit in the System with this Email id  ");
				session.setAttribute("message",
						new Message("User does not Exit in the System with this Email id  " + emailid, "alert-danger"));
				return "forgot-openEmail-form";

			} else {
				// send chaeg password
				return "change-password";

			}

		}
		model.addAttribute("errorMessage", "InValid OTP Please Check!!");
		session.setAttribute("message", new Message("InValid OTP", "alert-danger"));
		return "verify-otp";

	}

	@PostMapping("/changepassword")
	public String getNewPassword(@RequestParam("password") String newPassword, HttpSession session, Model model) {
		System.out.println("Password: =" + newPassword);

		String emailid = (String) session.getAttribute("myEmail");
		UserEntity user = userService.getUserByUsername(emailid).get();
		String encodedPassword = encoder.encode(newPassword);

		user.setPassword(encodedPassword);
		userService.saveUsers(user);
		model.addAttribute("successMessage", "Password Forgot Successfully");
		session.setAttribute("message", new Message("Password Forgot Successfully", "alert-success"));
		model.addAttribute("user", new UserDTO());
		return "login";
	}

	// goes the cahge password page hereeee
	@GetMapping("/changepassword")
	public String chagePassword(Model model, HttpSession session) {
		System.out.println("Goes the passsword change Modules");
		try {
			UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");
			if (loggedUser != null) {
				model.addAttribute("loggedUser", loggedUser);
				String role = loggedUser.getRole();
				if (role.equals("USER")) {
					return "users/password-update";
				} else if (role.equals("POLICE")) {
					return "polices/change-password";

				} else {

					return "admin/change-password";
				}
			} else {

				model.addAttribute("errorMeaage", "Please Login First !!!");
				return "redirect:/onlinecrimereportingsystem/login";
			}

		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("errorMeaage", "Error: " + e.getMessage());
			return "redirect:/onlinecrimereportingsystem/login";
		}
	}
	// change passworddddddd

	@PostMapping("/password-update")
	public String updatePassword(HttpServletRequest request, @RequestParam("oldpassword") String oldPassword,
			@RequestParam("password") String newPassword, Model model, HttpSession session) {

		System.out.println("Change Password Module Come junedddddddd");
		String URL = null;
		String role = null;
		System.out.println("Request:=" + request.getRequestURL());
		String requestURL = request.getRequestURL().toString();
		UserEntity loggedUser = (UserEntity) session.getAttribute("loggedUser");

		if (loggedUser != null) {
			try {
				String emailid = loggedUser.getEmailid();
				Optional<UserEntity> optionalUser = userRepository.findByEmailid(emailid);

				if (optionalUser.isEmpty()) {
					model.addAttribute("errorMessage", "User not found with this email!");
					return requestURL;
				}

				UserEntity user = optionalUser.get();
				if (user != null) {

					role = user.getRole();
					System.out.println("UserRole==" + role);
					if ("USER".equals(role)) {
						URL = "users/password-update";
					} else if ("ADMIN".equals(role)) {
						URL = "admin/change-password";
					} else if ("POLICE".equals(role)) {
						URL = "polices/change-password";
					}

					if (!encoder.matches(oldPassword, user.getPassword())) {
						model.addAttribute("errorMessage", "Old password is incorrect!");
						return URL;
					}

					String encodedNewPassword = encoder.encode(newPassword);
					user.setPassword(encodedNewPassword);
					userRepository.save(user);

					model.addAttribute("successMessage", "Password updated successfully!");
					return URL;
				}
			} catch (Exception e) {

				e.printStackTrace();
				model.addAttribute("errorMeaage", "Error: " + e.getMessage());
				return "redirect:/onlinecrimereportingsystem/login";
			}
			model.addAttribute("errorMessage", "So,e thing Went Wrong...");
			return "redirect:/onlinecrimereportingsystem/login";
		} else {
			model.addAttribute("errorMessage", "Please Login First");
			return "redirect:/onlinecrimereportingsystem/login";
		}
	}

}
