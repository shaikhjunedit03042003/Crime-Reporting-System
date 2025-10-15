package com.springboot.onlinereporting.system.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.onlinereporting.system.emails.OTPGenerator;
import com.springboot.onlinereporting.system.emails.SendEmail;
import com.springboot.onlinereporting.system.helper.Message;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping(("/onlinecrimereportingsystem/otp"))
public class OTPController {

	@GetMapping("/signup/send_otp")
	public ResponseEntity<Map<String, Object>> sendOTP(@RequestParam("email") String email, HttpSession session,
			Model model) {
		Map<String, Object> response = new HashMap<>();
		System.out.println("emaild id: " + email);
		OTPGenerator otpGenerator = new OTPGenerator();
		int otp = otpGenerator.optGenerate();
		SendEmail sendEmail = new SendEmail();
		String subject = "OTP From Online Crime Reporting System";
		String to = email;
		String message = "<div style='border:1px solid #2e2e2;padding:20px'>" + "OTP    " + "<b>" + otp + "</div>";
		boolean status = sendEmail.sendEmail(to, subject, message);
		System.out.println("Come here testin case status in the Signup form : " + status);

		if (status) {//
			session.setAttribute("myOTP", String.valueOf(otp));
			session.setAttribute("myEmail", email);
			// Rsponse set here
			response.put("success", true);
			response.put("message", "We have Sent OTP to you Email....");
		} else {
			model.addAttribute("messageError", "Oops! Something went Wrong Please check your email id");
			response.put("success", false);
			response.put("errorMessage", "Oops! Something went Wrong Please check your email id");

		}
		return ResponseEntity.ok(response);

	}

	@PostMapping("/signup/verify_otp")
	public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> payload,
			HttpSession session) {
		String email = payload.get("email");
		String otp = payload.get("otp");

		System.out.println("Email in verify: " + email);
		System.out.println("OTP:==" + otp);

		Map<String, Object> response = new HashMap<>();

		String sessionOtp = (String) session.getAttribute("myOTP");
		String sessionEmail = (String) session.getAttribute("myEmail");

		if (sessionOtp != null && sessionEmail != null && sessionEmail.equals(email) && otp.equals(sessionOtp)) {
			response.put("success", true);
		} else {
			response.put("success", false);
		}
		System.out.println("response==" + response);

		return ResponseEntity.ok(response);
	}

}
