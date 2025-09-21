package com.springboot.onlinereporting.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.PoliceLoginDTO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.entities.ComplaintEntity;
import com.springboot.onlinereporting.system.repositories.PoliceOfficerRepository;
import com.springboot.onlinereporting.system.services.ComplaintServce;
import com.springboot.onlinereporting.system.services.PoliceLoginService;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/onlinecrimereportingsystem/police")
public class PoliceController {
	@Autowired
	private PoliceLoginService policeLoginService;
	@Autowired
	private PoliceOfficerService policeOfficerService;
	
	@Autowired
	private ComplaintServce complaintService;

	@Autowired
	private PoliceOfficerRepository policeOfficerRepository;

	@GetMapping("/policelogin")
	public String policeDashboard(Model model) {

		System.out.println("Police Login Pages goes from hereeeeee...");
		model.addAttribute("policeLoginDTO", new PoliceLoginDTO());
		return "polices/police-login";

	}

	@PostMapping("/policelogin")
	public String policeLogin(@Valid @ModelAttribute("policeLoginDTO") PoliceLoginDTO policeDTO, BindingResult errors,
			Model model, HttpSession session) {
		System.out.println("policeDTO===" + policeDTO);

		if (errors.hasErrors()) {

			model.addAttribute("errorMessage", "Some thing Went Wrong!!");
			model.addAttribute("policeLoginDTO", policeDTO);
			return "polices/police-login";
		}
		PoliceOfficerBO policeLoginBO = policeLoginService.getPoliceOfficer(policeDTO.getEmail(),
				policeDTO.getContactNumber());
		if (policeLoginBO != null) {
			if (policeLoginBO.getEmail().equals(policeDTO.getEmail())
					&& policeLoginBO.getContactNumber().equals(policeDTO.getContactNumber())) {

				model.addAttribute("successMessage", "Police Suucess Fully Login");
				model.addAttribute("policeLoginDTO", new PoliceLoginDTO());
				session.setAttribute("police", policeLoginBO);
				return "polices/police-dashboard";
			} else {
				model.addAttribute("errorMessage",
						"Email Address and Conatct Number can Not Matched OR Invalide Police Officers Please Enter Correct Details !!!");
				model.addAttribute("policeLoginDTO", policeDTO);
				return "polices/police-dashboard";

			}

		} else {
			model.addAttribute("errorMessage", "Some thing Went Wrong!!");
			model.addAttribute("policeLoginDTO", policeDTO);
			return "polices/police-login";

		}

	}

	@GetMapping("/image/{id}")
	@ResponseBody
	public ResponseEntity<byte[]> getPoliceImage(@PathVariable Long id) {

		System.out.println(" ID:=" + id);
		return policeOfficerRepository.findById(id).map(police -> {
			byte[] image = police.getImgaes();
			String contentType = police.getContentType() != null ? police.getContentType() : "image/jpeg";

			return ResponseEntity.ok().header("Content-Type", contentType).body(image);
		}).orElse(ResponseEntity.notFound().build());
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

	// Show complaints for a police station
    @GetMapping("/complaints/{policeCode}")
    public String getComplaintsByPoliceStation(@PathVariable("policeCode") String policeCode,
                                               Model model) {
        List<ComplaintEntity> complaints = complaintService.getComplaintsByPoliceStation(policeCode);
        model.addAttribute("complaints", complaints);
       
        return "police/complaints-list"; 
    }
}
