package com.springboot.onlinereporting.system.controller;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.springboot.onlinereporting.system.entities.FIREntity;
import com.springboot.onlinereporting.system.repositories.FIRRepository;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@SuppressWarnings("unused")
@Controller
@Slf4j
@RequestMapping("/onlinecrimereportingsystem/police/reports")
public class ReportsController {
	@Autowired
	private FIRRepository firRepository;

	@GetMapping
	public String showReports(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
		List<FIREntity> firs = firRepository.findAll();
		model.addAttribute("firs", firs);
		System.out.println("All FIRs===>" + firs);
		return "polices/reports";
	}

	@GetMapping("/summary")
	@ResponseBody
	public ResponseEntity<byte[]> generateSummaryReport() {
		Document document = new Document();
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		try {
			PdfWriter.getInstance(document, out);
			document.open();

			document.add(new Paragraph("FIR Summary Report"));
			document.add(new Paragraph(
					"Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"))));
			document.add(new Paragraph(" "));

			PdfPTable table = new PdfPTable(5);
			table.setWidthPercentage(100);
			table.setWidths(new float[] { 1.5f, 3f, 2f, 1.5f, 2f });

			table.addCell("FIR Number");
			table.addCell("Title");
			table.addCell("Crime Type");
			table.addCell("Status");
			table.addCell("Created At");

			List<FIREntity> firs = firRepository.findAll();
			if (firs != null && !firs.isEmpty()) {
				for (FIREntity fir : firs) {
					table.addCell(fir.getFirNumber() != null ? fir.getFirNumber() : "N/A");
					table.addCell(fir.getTitle() != null ? fir.getTitle() : "N/A");
					table.addCell(fir.getCrimeType() != null ? fir.getCrimeType() : "N/A");
					table.addCell(fir.getStatus() != null ? fir.getStatus() : "N/A");
					table.addCell(fir.getCreatedAt() != null
							? fir.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"))
							: "N/A");
				}
			} else {
				table.addCell("No FIRs available");
				table.addCell("");
				table.addCell("");
				table.addCell("");
				table.addCell("");
			}

			document.add(table);
			document.close();

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			String fileName = "summary_report_"
					+ LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf";
			headers.setContentDispositionFormData("attachment", fileName);
			headers.setCacheControl("no-cache, no-store, must-revalidate");
			headers.setPragma("no-cache");
			headers.setExpires(0);

			return ResponseEntity.ok().headers(headers).body(out.toByteArray());
		} catch (DocumentException e) {
			log.error("Error generating PDF report: {}", e.getMessage());
			document.close();
			throw new RuntimeException("Failed to generate PDF report: " + e.getMessage());
		} finally {
			try {
				out.close();
			} catch (Exception e) {
				log.warn("Error closing ByteArrayOutputStream: {}", e.getMessage());
			}
		}
	}
}