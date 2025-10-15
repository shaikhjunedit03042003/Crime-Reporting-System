package com.springboot.onlinereporting.system.emails;

import java.security.SecureRandom;
import java.util.Random;

public class OTPGenerator {
	public static void main(String[] args) {

	}

	public int optGenerate() {
		SecureRandom secureRandom = new SecureRandom();
		int otp = 100000 + secureRandom.nextInt(900000);
		System.out.println("Generated OTP: " + otp);
		return otp;
	}

	public int otpGenerateByRandom() {
		Random random = new Random();
		int otp = 100000 + random.nextInt(999999);
		System.out.println("OTP==" + otp);
		return otp;
	}
}
