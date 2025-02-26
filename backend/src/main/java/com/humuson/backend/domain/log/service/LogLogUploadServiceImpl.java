package com.humuson.backend.domain.log.service;

import com.humuson.backend.global.exception.FileUploadException;
import com.humuson.backend.global.exception.InvalidFileFormatException;
import com.humuson.backend.infrastructure.log.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogLogUploadServiceImpl implements LogUploadService {

    private final LogRepository logRepository;

    @Override
    public String saveUploadedLog(MultipartFile file) {

        if (!isValidLogFile(file)) {
            throw new InvalidFileFormatException();
        }

        try {
            return logRepository.saveLog(file);
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new FileUploadException();
        }
    }

    private boolean isValidLogFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName != null && (fileName.endsWith(".log") || fileName.endsWith(".txt"));
    }

}
