package com.springboot.onlinereporting.system.controller;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.springboot.onlinereporting.system.entities.FIREntity;
import com.springboot.onlinereporting.system.repositories.FIRRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/onlinecrimereportingsystem/police/manage/fir/api/pdf")
public class PdfController {

	@Autowired
	private FIRRepository firRepository;

	@GetMapping("/generate-fir")
	public ResponseEntity<byte[]> generateFirPdf(@RequestParam("firNumber") String firNumber,
			@RequestParam("complaintId") Long complaintId) {
		System.out.println("firNumber===" + firNumber);
		System.out.println("complaintId===" + complaintId);

		try {

			Optional<FIREntity> firOptional = firRepository.findByFirNumberAndComplaintId(firNumber, complaintId);
			if (!firOptional.isPresent()) {
				throw new RuntimeException(
						"FIR not found for FIR Number: " + firNumber + " and Complaint ID: " + complaintId);
			}
			FIREntity fir = firOptional.get();
			System.out.println("firOptional==" + firOptional);

			Document document = new Document();
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			PdfWriter.getInstance(document, out);

			document.open();

			document.add(new Paragraph("First Information Report (FIR)"));
			document.add(new Paragraph("Generated on: "
					+ java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"))));
			document.add(new Paragraph(" "));

			PdfPTable table = new PdfPTable(2);
			table.setWidthPercentage(100);
			table.setWidths(new float[] { 1, 2 });

			addTableRow(table, "FIR Number", fir.getFirNumber());
			addTableRow(table, "Title", fir.getTitle());
			addTableRow(table, "Description", fir.getDescription());
			addTableRow(table, "Location", fir.getLocation());
			addTableRow(table, "Crime Type", fir.getCrimeType());
			addTableRow(table, "Status", fir.getStatus());
			addTableRow(table, "Created At",
					fir.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")));
			addTableRow(table, "Updated At",
					fir.getUpdatedAt().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")));
			addTableRow(table, "Officer Notes", fir.getCaseOfficerNotes() != null ? fir.getCaseOfficerNotes() : "N/A");
			addTableRow(table, "Under Investigation",
					fir.getIsUnderInvestigation() != null ? (fir.getIsUnderInvestigation() ? "Yes" : "No") : "N/A");

			document.add(table);

			document.close();

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDispositionFormData("attachment", "FIR_" + firNumber + ".pdf");

			return ResponseEntity.ok().headers(headers).body(out.toByteArray());

		} catch (DocumentException e) {
			throw new RuntimeException("Error generating PDF: " + e.getMessage());
		}
	}

	private void addTableRow(PdfPTable table, String label, String value) {
		PdfPCell cell = new PdfPCell(new Paragraph(label + ":"));
		cell.setBorder(PdfPCell.NO_BORDER);
		table.addCell(cell);
		cell = new PdfPCell(new Paragraph(value != null ? value : "N/A"));
		cell.setBorder(PdfPCell.NO_BORDER);
		table.addCell(cell);
	}
}