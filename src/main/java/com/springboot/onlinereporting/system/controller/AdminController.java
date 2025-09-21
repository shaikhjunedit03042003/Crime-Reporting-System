package com.springboot.onlinereporting.system.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.springboot.onlinereporting.system.BO.PoliceStationBO;
import com.springboot.onlinereporting.system.DTO.CrimeTypedDTO;
import com.springboot.onlinereporting.system.DTO.PoliceStationEntryDTO;
import com.springboot.onlinereporting.system.entities.PoliceStationEntry;
import com.springboot.onlinereporting.system.entities.UserEntity;
import com.springboot.onlinereporting.system.helper.Message;
import com.springboot.onlinereporting.system.mapper.PoliceStationMapper;
import com.springboot.onlinereporting.system.repositories.CrimeTypeRepository;
import com.springboot.onlinereporting.system.services.CrimeTypedService;
import com.springboot.onlinereporting.system.services.PoliceStationEntryService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/onlinecrimereportingsystem/admins")

public class AdminController {
	@Autowired
	private PoliceStationMapper policeStationMapper;

	@Autowired
	private PoliceStationEntryService policeStationEntryService;

	@Autowired
	private CrimeTypedService crimeTypedService;

	// admin home controller
	@GetMapping({ "", "/dashboard", "/adminhome" })
	public String userHome(Model model) {
		model.addAttribute("title", "Admin Dashboard - Online Crime Reporting System");

		return "admin/admin-dashboard";
	}

	// admin dashboard
	@GetMapping("/admin-dashboard")
	public String adminDashboard() {

		return "admin/admin-dashboard";
	}

	@GetMapping("/policestationentryform")
	public String policeStationEnryForm(Model model) {
		System.out.println("in get of police staion entry ");
		model.addAttribute("policestationentryDTO", new PoliceStationEntryDTO());
		model.addAttribute("title", "Police Station Entry Form");
		return "admin/police-station-entry-form";

	}

	@PostMapping("/policestationfillingform")
	public String policestattionFillingForm(
			@Valid @ModelAttribute("policestationentryDTO") PoliceStationEntryDTO policestationentryDTO,
			BindingResult errors, Model model, HttpSession session) {

		if (errors.hasErrors()) {
			System.out.println("Validation errors for other fields");
			System.out.println("Error: " + errors.toString());
			model.addAttribute("policestationentryDTO", policestationentryDTO);
			return "admin/police-station-entry-form";
		}
		// Convert DTO to BO
		PoliceStationBO policeStationBO = policeStationMapper.toBO(policestationentryDTO);

		// Check if station exists
		PoliceStationEntry policeCheck = policeStationEntryService.getStationNameORstationCodeORemailAddress(
				policeStationBO.getStationName(), policeStationBO.getStationCode(), policeStationBO.getEmailAddress());
		if (policeCheck != null) {
			model.addAttribute("policestationentryDTO", policestationentryDTO);
			session.setAttribute("message", new Message("This Police Station Already Exists!", "alert-danger"));
			model.addAttribute("errorMessage", "This Police Station Already Exists!");
			return "admin/police-station-entry-form";
		}

		// Convert BO to Entity
		PoliceStationEntry policeStationEntry = policeStationMapper.toEntity(policeStationBO);

		// Save entity
		PoliceStationEntry savedPolice = policeStationEntryService.savePoliceStation(policeStationEntry);
		if (savedPolice == null) {
			model.addAttribute("policestationentryDTO", policestationentryDTO);
			session.setAttribute("message", new Message("Something Went Wrong!", "alert-danger"));
			model.addAttribute("errorMessage", "Something Went Wrong!");
			return "admin/police-station-entry-form";
		}

		model.addAttribute("policestationentryDTO", new PoliceStationEntryDTO());
		session.setAttribute("message", new Message("Successfully Save  !!", "alert-success"));
		model.addAttribute("successMessage", "Successfully Save  !!");
		return "admin/police-station-entry-form";

	}

	@GetMapping("/add-crime")
	public String addCrime(Model model) {
		model.addAttribute("crimetypeDTO", new CrimeTypedDTO());
		return "admin/add-crime";
	}

	@PostMapping("/add-crime")
	public String sendCrimeTyped(@Valid @ModelAttribute("crimetypeDTO") CrimeTypedDTO crimeTypedDTO,
			BindingResult errors, Model model, HttpSession session) {

		if (errors.hasErrors()) {
			System.out.println("Validation errors for other fields");
			System.out.println("Error: " + errors.toString());
			model.addAttribute("crimetypeDTO", crimeTypedDTO);
			model.addAttribute("errorMessage", "  CrimeTyped is Empty !");
			return "admin/add-crime";
		}
		if (crimeTypedService.exitCrimeTyped(crimeTypedDTO.getCrimeType())) {
			model.addAttribute("errorMessage", "  CrimeTyped Already Exits !");
			model.addAttribute("crimetypeDTO", crimeTypedDTO);

			return "admin/add-crime";

		}

		CrimeTypedDTO ctDTO = crimeTypedService.saveCrimeTyped(crimeTypedDTO);
		if (ctDTO != null) {
			model.addAttribute("successMessage", "  CrimeTyped Save Successfully !");
			model.addAttribute("crimetypeDTO", new CrimeTypedDTO());

			return "admin/add-crime";
		} else {
			model.addAttribute("errorMessage", "  CrimeTyped Save Failed !");
			model.addAttribute("crimetypeDTO", crimeTypedDTO);

			return "admin/add-crime";
		}
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

	// Views All Police Stations
	@GetMapping("/viewspolicestations")
	public String viewAllPoiceStations(Model model) {
		List<PoliceStationEntryDTO> policeStationEntryDTO = policeStationEntryService.viewAllPoliceStations();

		System.out.println("allPoliceStation==" + policeStationEntryDTO);
		model.addAttribute("policeStationEntryDTOs", policeStationEntryDTO);
		return "admin/view-all-police-station";
	}

	// Views Single Police Station
	@GetMapping("/viewpolicestation")
	public String viewPoiceStation(@RequestParam String id, Model model) {
		Long policeStationId = Long.parseLong(id);

		PoliceStationBO bo = policeStationEntryService.findPoliceStation(policeStationId);
		if (bo != null) {
			PoliceStationEntryDTO policeStationEntryDTO = PoliceStationEntryDTO.of().addressLine1(bo.getAddressLine1())
					.addressLine2(bo.getAddressLine2()).area(bo.getArea()).city(bo.getCity())
					.contactNumber(bo.getContactNumber()).emailAddress(bo.getEmailAddress())
					.emergencyNumber(bo.getEmergencyNumber()).faxNumber(bo.getFaxNumber()).id(bo.getId())
					.landMark(bo.getLandMark()).pincode(bo.getPincode()).state(bo.getState())
					.stationCode(bo.getStationCode()).stationName(bo.getStationName()).build();

			System.out.println("allPoliceStation==" + policeStationEntryDTO);
			model.addAttribute("policestationentryDTO", policeStationEntryDTO);
			return "admin/view-policestation";
		} else {

			model.addAttribute("errorMessage", "Police Station NOT FOUND");
			return "admin/view-all-police-station";
		}
	}

	// update Police Station
	@PostMapping("/updatepolicestation/{id}")
	public String updatePoliceStation(@PathVariable("id") String id,
			@Valid @ModelAttribute PoliceStationEntryDTO policeStationEntryDTO, BindingResult errors, Model model) {

		System.out.println("Before Update policeStationEntryDTO===" + policeStationEntryDTO);
		if (errors.hasErrors()) {
			System.out.println("Some thisng went wrong heree");
			model.addAttribute("policestationentryDTO", policeStationEntryDTO);
			model.addAttribute("errorMessage", "Some thing Went Wrong !!!");
			return "admin/view-policestation";

		}

		Long policeStationId = Long.parseLong(id);
		// DTO TO BO
		PoliceStationBO policeStationBO = PoliceStationBO.of().addressLine1(policeStationEntryDTO.getAddressLine1())
				.addressLine2(policeStationEntryDTO.getAddressLine2()).area(policeStationEntryDTO.getArea())
				.city(policeStationEntryDTO.getCity()).contactNumber(policeStationEntryDTO.getContactNumber())
				.emailAddress(policeStationEntryDTO.getEmailAddress())
				.emergencyNumber(policeStationEntryDTO.getEmergencyNumber())
				.faxNumber(policeStationEntryDTO.getFaxNumber()).id(policeStationEntryDTO.getId())
				.landMark(policeStationEntryDTO.getLandMark()).pincode(policeStationEntryDTO.getPincode())
				.state(policeStationEntryDTO.getState()).stationCode(policeStationEntryDTO.getStationCode())
				.stationName(policeStationEntryDTO.getStationName())

				.build();

		PoliceStationBO bo = policeStationEntryService.updatePoliceStationById(policeStationId, policeStationBO);

		// BO to DTO

		PoliceStationEntryDTO policeStationEntryDTO2 = PoliceStationEntryDTO.of().addressLine1(bo.getAddressLine1())
				.addressLine2(bo.getAddressLine2()).area(bo.getArea()).city(bo.getCity())
				.contactNumber(bo.getContactNumber()).emailAddress(bo.getEmailAddress())
				.emergencyNumber(bo.getEmergencyNumber()).faxNumber(bo.getFaxNumber()).id(bo.getId())
				.landMark(bo.getLandMark()).pincode(bo.getPincode()).state(bo.getState())
				.stationCode(bo.getStationCode()).stationName(bo.getStationName())

				.build();
		System.out.println("After Update policeStationEntryDTO2==" + policeStationEntryDTO2);
		if (policeStationEntryDTO2 != null) {
			model.addAttribute("policestationentryDTO", policeStationEntryDTO2);
			model.addAttribute("successMessage", "Police Station Update Successfully !!!!");
			return "admin/view-policestation";
		} else {

			model.addAttribute("policestationentryDTO", policeStationEntryDTO);
			model.addAttribute("errorMessage", "Failed to update Police Station Details !!!");
			return "admin/view-policestation";

		}

	}

	// Delete Police Station

	@DeleteMapping("/deletepolicestation/{id}")
	@ResponseBody
	public ResponseEntity<String> deletepolicestation(@PathVariable("id") String id, HttpSession session) {

		Long policeStatuionId = Long.parseLong(id);
		boolean deleteStatus = policeStationEntryService.deletePoliceStation(policeStatuionId);

		if (deleteStatus) {
			return ResponseEntity.ok("Deleted successfully");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete");
		}
	}

}
