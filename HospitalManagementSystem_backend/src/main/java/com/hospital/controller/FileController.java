package com.hospital.controller;

import com.hospital.common.Result;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FileController {

	private static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads");

	@PostMapping("/upload")
	public Result<String> upload(@RequestParam("file") MultipartFile file, jakarta.servlet.http.HttpServletRequest request) throws IOException {
		if (file.isEmpty()) {
			return Result.error("文件为空");
		}
		if (!Files.exists(UPLOAD_DIR)) {
			Files.createDirectories(UPLOAD_DIR);
		}
		String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
		String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
		String filename = time + "_" + UUID.randomUUID().toString().replace("-", "");
		if (ext != null && !ext.isEmpty()) {
			filename = filename + "." + ext;
		}
		Path target = UPLOAD_DIR.resolve(filename);
		file.transferTo(target);
		// 返回下载/预览 URL
		String relativeUrl = "/files/" + filename;
		String contextPath = request.getContextPath() == null ? "" : request.getContextPath();
		String url = org.springframework.web.servlet.support.ServletUriComponentsBuilder
				.fromCurrentContextPath()
				.path(contextPath)
				.path(relativeUrl)
				.toUriString();
		return Result.success(url);
	}

	@GetMapping("/{filename}")
	public ResponseEntity<byte[]> download(@PathVariable String filename) throws IOException {
		Path file = UPLOAD_DIR.resolve(filename);
		if (!Files.exists(file)) {
			return ResponseEntity.notFound().build();
		}
		byte[] bytes = Files.readAllBytes(file);
		String contentType = Files.probeContentType(file);
		if (contentType == null) {
			contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
		}
		return ResponseEntity.ok()
			.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
			.contentType(MediaType.parseMediaType(contentType))
			.body(bytes);
	}
}


