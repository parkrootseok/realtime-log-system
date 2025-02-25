package com.humuson.backend.application.log.usecase;

import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

    String uploadLog(MultipartFile file);

}
