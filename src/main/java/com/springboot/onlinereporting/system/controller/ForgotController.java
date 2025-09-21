package com.springboot.onlinereporting.system.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/onlinecrimereportingsystem/forgotpassword")
public class ForgotController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private UserRepository userRepository;

	@GetMapping("/forgot")
	public String openEmail() {

		return "forgot-openEmail-form";
	}

	@PostMapping("/forgot")
	public String varifyEmail(@RequestParam("emailid") String email, HttpSession session) {
		System.out.println("emaild id: " + email);
		OTPGenerator otpGenerator = new OTPGenerator();
		int otp = otpGenerator.optGenerate();
		SendEmail sendEmail = new SendEmail();
		String subject = "OTP From Online Crime Reporting System";
		String to = email;
		String message = "<div style='border:1px solid #2e2e2;padding:20px'>" + "OTP    " + "<b>" + otp + "</div>";
		boolean status = sendEmail.sendEmail(to, subject, message);
		System.out.println("Come here testingggg case status: " + status);

		if (status) {
			session.setAttribute("message", new Message("We have Sent OTP to you Email....", "alert-success"));
			session.setAttribute("myOTP", otp);
			session.setAttribute("myEmail", email);
			return "verify-otp";
		} else {
			session.setAttribute("message",
					new Message("Oops Some thing Wrong Please Check yourEmail id", "alert-danger"));
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
		model.addAttribute("errorMessage","InValid OTP Please Check!!");
		session.setAttribute("message", new Message("InValid OTP", "alert-danger"));
		return "verify-otp";

	}

	@PostMapping("/changepassword")
	public String getNewPassword(@RequestParam("password") String newPassword, HttpSession session, Model model) {
		System.out.println("Password: =" + newPassword);

		String emailid = (String) session.getAttribute("myEmail");
		UserEntity user = userService.getUserByUsername(emailid).get();
		user.setPassword(newPassword);
		userService.saveUsers(user);
		model.addAttribute("successMessage","Password Forgot Successfully");
		session.setAttribute("message", new Message("Password Forgot Successfully", "alert-success"));
		model.addAttribute("user", new UserDTO());
		return "login";
	}
	
	//goes the cahge password page hereeee
	@GetMapping("/changepassword")
	public String chagePassword() {

		return "users/password-update"; 
	}
	
	
	//change passworddddddd
	
    @PostMapping("/password-update")
    public String updatePassword(@RequestParam("emailid") String emailid,
                                 @RequestParam("oldpassword") String oldPassword,
                                 @RequestParam("password") String newPassword,
                                 Model model,
                                 HttpSession session) {

        Optional<UserEntity> optionalUser = userRepository.findByEmailid(emailid);

        if (optionalUser.isEmpty()) {
            model.addAttribute("errorMessage", "User not found with this email!");
            return "users/password-update"; 
        }

        UserEntity user = optionalUser.get();

      
        if (!user.getPassword().equals(oldPassword)) {
            model.addAttribute("errorMessage", "Old password is incorrect!");
            return "users/password-update"; 
        }

        user.setPassword(newPassword); 
        userRepository.save(user);
        model.addAttribute("successMessage", "Password updated successfully!");
        return "users/password-update"; 
    }
}
