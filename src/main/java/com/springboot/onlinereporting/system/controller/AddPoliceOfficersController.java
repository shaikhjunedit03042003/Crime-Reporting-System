package com.springboot.onlinereporting.system.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.BO.PoliceOfficerBO;
import com.springboot.onlinereporting.system.DTO.PoliceOfficerDTO;
import com.springboot.onlinereporting.system.helper.ByteArraytoMultipartFile;
import com.springboot.onlinereporting.system.services.PoliceOfficerService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/onlinecrimereportingsystem/admins/addpoliceofficer")

public class AddPoliceOfficersController {

	@Autowired
	private PoliceOfficerService policeOfficerService;

	@GetMapping
	public String showPoliceOfficers(Model model) {
		model.addAttribute("policeOfficerDTO", new PoliceOfficerDTO());
		return "admin/add-police-officers";
	}

	@PostMapping("/addpoliceofficer")
	public String addPoliceOfficers(@Valid @ModelAttribute("policeOfficerDTO") PoliceOfficerDTO policeOfficerDTO,
			MultipartFile image, BindingResult errors, Model model, HttpSession session) {

		if (errors.hasErrors()) {
			System.out.println("Police officer Validation errors for other fields");
			System.out.println("Error: " + errors.toString());
			model.addAttribute("policeOfficerDTO", policeOfficerDTO);
			model.addAttribute("errorMessage", "  policeOfficer is Something Wrong !");
			return "admin/add-police-officers";
		}

		System.out.println("policeOfficerDTO===" + policeOfficerDTO);
		// DTO->BO
		byte[] image_byte = null;
		try {
			image_byte = policeOfficerDTO.getPoliceImages().getBytes();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		PoliceOfficerBO bo = new PoliceOfficerBO();
		bo.setBadgeNumber(policeOfficerDTO.getBadgeNumber());
		bo.setContactNumber(policeOfficerDTO.getContactNumber());
		bo.setEmail(policeOfficerDTO.getEmail());
		bo.setId(policeOfficerDTO.getId());
		bo.setImages(image_byte);
		bo.setName(policeOfficerDTO.getName());
		bo.setPoliceStation(policeOfficerDTO.getPoliceStation());
		bo.setPoliceStationselect(policeOfficerDTO.getPoliceStationselect());
		bo.setRank(policeOfficerDTO.getRank());
		bo.setFilename(policeOfficerDTO.getPoliceImages().getName());
		bo.setContentType(policeOfficerDTO.getPoliceImages().getContentType());

		if (policeOfficerService.getBadgeNumber(policeOfficerDTO.getBadgeNumber(),
				policeOfficerDTO.getPoliceStationselect())) {
			model.addAttribute("policeOfficerDTO", policeOfficerDTO);
			model.addAttribute("errorMessage", "this Police Officer Already Exit on this Police Station!!!!");
			return "admin/add-police-officers";
		}
		PoliceOfficerDTO policeSave = policeOfficerService.savePoliceOfficers(bo);
		System.out.println("Afetr policeSave====" + policeSave);
		if (policeSave != null) {
			model.addAttribute("successMessage", "  PoliceOfficer Added Successfully ... !");
			model.addAttribute("policeOfficerDTO", new PoliceOfficerDTO());
			return "admin/add-police-officers";

		} else {
			model.addAttribute("policeOfficerDTO", policeOfficerDTO);
			model.addAttribute("errorMessage", "  policeOfficer is Something Wrong !");
			return "admin/add-police-officers";

		}
	}

	// Find All PolieceOfficers
	@GetMapping("/viewsAllPoliceOfficers")
	public String viewsAllPoliceOfficers(Model model) {

		List<PoliceOfficerDTO> policeOfficerDTOs = policeOfficerService.getAllPoliceOfficers();

		try {
			if (policeOfficerDTOs != null) {
				model.addAttribute("policeOfficerDTOs", policeOfficerDTOs);
				return "admin/views-all-police-officers";

			} else {
				model.addAttribute("errorMessage", "Police Officers NOT FOund!");
				return "redirect:/onlinecrimereportingsystem/admins/addpoliceofficer";

			}
		} catch (Exception e) {
			model.addAttribute("errorMessage", "Error:=" + e.getMessage());

			return "redirect:/onlinecrimereportingsystem/admins/addpoliceofficer";

		}

	}

	@GetMapping("/{id}")
	public String viewPoliceOfficer(@PathVariable("id") String id, Model model) {

		System.out.println("id of teh police officer for views or update" + id);
		Long policeId = Long.parseLong(id);
		PoliceOfficerBO policeOfficerBO = policeOfficerService.getPoliceOfficerById(policeId);
		if (policeOfficerBO != null) {
			PoliceOfficerDTO policeOfficerDTO = PoliceOfficerDTO.of().badgeNumber(policeOfficerBO.getBadgeNumber())
					.contactNumber(policeOfficerBO.getContactNumber()).contentType(policeOfficerBO.getContentType())
					.email(policeOfficerBO.getEmail()).filename(policeOfficerBO.getFilename())
					.id(policeOfficerBO.getId()).name(policeOfficerBO.getName()).policeImages(null)
					.policeStation(policeOfficerBO.getPoliceStation())
					.policeStationselect(policeOfficerBO.getPoliceStationselect()).rank(policeOfficerBO.getRank())

					.build();
			model.addAttribute("policeOfficerDTO", policeOfficerDTO);
			return "admin/update-police-officer";
		}
		model.addAttribute("errorMessage", "Police Officer NOT FOund !!");
		return "redirect:/viewsAllPoliceOfficers";
	}

	@PostMapping("/updatepoliceofficer/{id}")
	public String updatePoliceOfficers(@PathVariable("id") Long id,
			@Valid @ModelAttribute PoliceOfficerDTO policeOfficerDTO, BindingResult errors, Model model) {
		System.out.println("At the time Update Policeofficerss herreee==" + policeOfficerDTO);
		policeOfficerDTO.setId(id);
		
		if (errors.hasErrors()) {
			System.out.println("Error in fiels ="+errors.toString());
			model.addAttribute("errorMessage", "Some thing Went Wrong!!!");
			model.addAttribute("policeOfficerDTO", policeOfficerDTO);
			return "admin/update-police-officer";
		}
		byte[] image_byte = null;
		try {
			image_byte = policeOfficerDTO.getPoliceImages().getBytes();
			System.out.println("image_byte=="+image_byte);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		try {
			PoliceOfficerBO policeOfficerBO = PoliceOfficerBO.of().badgeNumber(policeOfficerDTO.getBadgeNumber())
					.contactNumber(policeOfficerDTO.getContactNumber()).contentType(policeOfficerDTO.getPoliceImages().getContentType())
					.email(policeOfficerDTO.getEmail()).filename(policeOfficerDTO.getPoliceImages().getName())
					.id(policeOfficerDTO.getId()).images(image_byte)
					.name(policeOfficerDTO.getName()).policeStation(policeOfficerDTO.getPoliceStation())
					.policeStationselect(policeOfficerDTO.getPoliceStationselect()).rank(policeOfficerDTO.getRank())
					.build();

			PoliceOfficerBO bo = policeOfficerService.updatePoliceOfficer(id, policeOfficerBO);
			if (bo != null) {
				PoliceOfficerDTO policeOfficerDTO2 = PoliceOfficerDTO.of().badgeNumber(bo.getBadgeNumber())
						.contactNumber(bo.getContactNumber()).contentType(bo.getContentType()).email(bo.getEmail())
						.filename(bo.getFilename()).id(bo.getId())
						// .policeImages(new
						// ByteArraytoMultipartFile(bo.getImages(),bo.getName(),bo.getContentType()))
						.name(bo.getName()).policeStation(bo.getPoliceStation())
						.policeStationselect(bo.getPoliceStationselect()).rank(bo.getRank())

						.build();
				model.addAttribute("successMessage", "Update Successfully ");
				model.addAttribute("policeOfficerDTO", policeOfficerDTO2);
				return "admin/update-police-officer";

			}
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("errorMessage", "Errorr:="+e.getMessage());
			model.addAttribute("policeOfficerDTO", policeOfficerDTO);
			return "admin/update-police-officer";

		}
		model.addAttribute("errorMessage", "Update Failed ");
		model.addAttribute("policeOfficerDTO", policeOfficerDTO);
		return "admin/update-police-officer";
	}

	// Delete Police Officerss hereeee

	@DeleteMapping("/deletepoliceofficers/{id}")
	@ResponseBody
	public ResponseEntity<String> deletePoliceOfficers(Model model, @PathVariable("id") String id) {

		System.out.println("Police Offficers ID=" + id);
		Long policeOfficerId = Long.parseLong(id);
		boolean deleteStatus = policeOfficerService.deletePoliceOffiser(policeOfficerId);
		System.out.println("deleteStatus police officerss==" + deleteStatus);
		if (deleteStatus) {
			return ResponseEntity.ok("Succeessfully deleted Police witth Id :" + id);
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to Delete this Police Officers");
		}

	}

}
