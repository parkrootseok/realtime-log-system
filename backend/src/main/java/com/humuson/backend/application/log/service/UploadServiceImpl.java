package com.humuson.backend.application.log.service;

import com.humuson.backend.application.log.usecase.UploadService;
import com.humuson.backend.domain.log.service.LogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

    private final LogService logService;

    @Override
    public String uploadLog(MultipartFile file) {
        try {
            return logService.saveLog(file);
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage());
            return "파일 업로드에 실패했습니다.";
        }
    }

}
