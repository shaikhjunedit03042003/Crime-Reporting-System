package com.springboot.onlinereporting.system.exceptionhandling;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.ui.Model;
import org.springframework.web.HttpRequestMethodNotSupportedException;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(HttpMessageNotWritableException.class)
	public ResponseEntity<Map<String, String>> handleSerializationException(HttpMessageNotWritableException ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Collections.singletonMap("error", "Failed to process response data"));
	}

	@ExceptionHandler(Exception.class)
	public String handleMethodException(Exception ex, Model model) {
		System.out.println("Requested URL: " + ex.getMessage());
		model.addAttribute("error", "Error : " + ex.getMessage());
		return "error";
	}

}