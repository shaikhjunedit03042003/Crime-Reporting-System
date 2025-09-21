package com.springboot.onlinereporting.system.emails;

import java.util.Properties;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class SendEmail {
	private final String fromEmail = "shaikhjunedit2003@gmail.com"; // sender email
	private final String password = "tloultwsbwulyvnu"; // your new app password (no spaces)

	public static void main(String[] args) {
		OTPGenerator otpGenerator = new OTPGenerator();
		int otp = otpGenerator.optGenerate();
		SendEmail sendEmail = new SendEmail();
		boolean status = sendEmail.sendEmail("shaikhjunedit@gmail.com", "Crime Reporting System Forgot Password OTP",
				String.valueOf(otp));
		System.out.println("Come here testin case status: " + status);

	}

	public boolean sendEmail(String toEmail, String subject, String body) {

		boolean status = false;

		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(fromEmail, password);
			}
		});

		try {
			Message message = new MimeMessage(session);

			message.setFrom(new InternetAddress(this.fromEmail));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
			message.setSubject(subject);
			// message.setText(text);
			System.out.println("body=="+body);
			message.setContent(
					"<html><body>" +body+ "<br>" + "<p>Note: Do not reply to this mail as it is system generated.</p>" + "</body></html>",
					"text/html");
			Transport.send(message);
			status = true;
			System.out.println("Email sent successfully!");

			return status;
		} catch (MessagingException e) {
			e.printStackTrace();
			return status;
		}
	}
}
