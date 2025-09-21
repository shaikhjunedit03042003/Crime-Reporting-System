package com.springboot.onlinereporting.system.helper;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ByteArraytoMultipartFile implements MultipartFile {
	private  byte[] content;
	private String name;
	private String originalFileName;
	private String contentType;

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return name;
	}

	@Override
	public String getOriginalFilename() {
		// TODO Auto-generated method stub
		return originalFileName;
	}

	@Override
	public String getContentType() {
		// TODO Auto-generated method stub
		return contentType;
	}

	@Override
	public boolean isEmpty() {
		// TODO Auto-generated method stub
		return content.length==0;
	}

	@Override
	public long getSize() {
		// TODO Auto-generated method stub
		return content.length;
	}

	@Override
	public byte[] getBytes() throws IOException {
		// TODO Auto-generated method stub
		return content;
	}

	@Override
	public InputStream getInputStream() throws IOException {
		// TODO Auto-generated method stub
		return new ByteArrayInputStream(content);
	}

	@Override
	public void transferTo(File dest) throws IOException, IllegalStateException {
		// TODO Auto-generated method stub
		try(FileOutputStream out=new FileOutputStream(dest)){
			out.write(content);
			
		}
		
	}

}
