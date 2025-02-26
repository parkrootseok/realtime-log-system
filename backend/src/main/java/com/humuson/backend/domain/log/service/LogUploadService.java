package com.humuson.backend.domain.log.service;

import org.springframework.web.multipart.MultipartFile;

public interface LogUploadService {

    String saveUploadedLog(MultipartFile file);

}
