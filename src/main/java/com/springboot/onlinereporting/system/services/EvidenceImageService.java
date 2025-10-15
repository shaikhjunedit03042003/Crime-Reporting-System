package com.springboot.onlinereporting.system.services;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.springboot.onlinereporting.system.entities.EvidenceImageEntity;
import com.springboot.onlinereporting.system.repositories.EvidenceImageRepository;

@Service
public class EvidenceImageService {

	@Autowired
	private EvidenceImageRepository evidenceImageRepository;

	private List<EvidenceImageEntity> tempImageList = new ArrayList<>();

	public void uploadImages(MultipartFile[] files) throws IOException {
		for (MultipartFile file : files) {
			if (!file.isEmpty()) {
				EvidenceImageEntity image = new EvidenceImageEntity();
				image.setFileName(file.getOriginalFilename());
				image.setContentType(file.getContentType());
				image.setFileSize(file.getSize());
				image.setContent(file.getBytes());
				image.setUploadDate(new Timestamp(System.currentTimeMillis()));
				tempImageList.add(image);
			}
		}
	}

	public List<EvidenceImageEntity> getAllEvi() {

		return tempImageList;
	}
	public List<Map<String, Object>> getTempImages() {
	    return tempImageList.stream().map(img -> {
	        Map<String, Object> map = new HashMap<>();
	        map.put("fileName", img.getFileName());
	        map.put("contentType", img.getContentType());
	        map.put("fileSize", img.getFileSize());
	        map.put("uploadDate", img.getUploadDate());
	        // Encode image content as base64
	        if (img.getContent() != null) {
	            map.put("content", Base64.getEncoder().encodeToString(img.getContent()));
	        } else {
	            map.put("content", ""); // Placeholder if no content
	        }
	        return map;
	    }).collect(Collectors.toList());
	}

	public void saveTempImages() {
		if (!tempImageList.isEmpty()) {
		//	evidenceImageRepository.saveAll(tempImageList);
			tempImageList.clear();
		}
	}

	public List<EvidenceImageEntity> getAllImages() {
		return evidenceImageRepository.findAll();
	}

	public Optional<EvidenceImageEntity> getImageById(Long id) {
		return evidenceImageRepository.findById(id);
	}
}