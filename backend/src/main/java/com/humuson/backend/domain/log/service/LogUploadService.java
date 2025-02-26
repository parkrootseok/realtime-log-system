package com.humuson.backend.domain.log.service;

import org.springframework.web.multipart.MultipartFile;

public interface LogUploadService {

    String saveLogFile(MultipartFile file);

}
