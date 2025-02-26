package com.humuson.backend.domain.log.service;

import com.humuson.backend.global.exception.FileUploadException;
import com.humuson.backend.global.exception.InvalidFileFormatException;
import com.humuson.backend.infrastructure.log.repository.LogRepository;
import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogUploadServiceImpl implements LogUploadService {

    private final LogRepository logRepository;

    @Override
    public String saveUploadedLog(MultipartFile file) {

        if (!isValidLogFile(file)) {
            throw new InvalidFileFormatException();
        }

        String newFileName = generateFileName(file.getOriginalFilename()); // UUID_파일명 생성

        try {
            return logRepository.saveLog(file, newFileName); // 새로운 파일명 전달
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new FileUploadException();
        }
    }

    private boolean isValidLogFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName != null && fileName.contains(".") && (fileName.endsWith(".log") || fileName.endsWith(".txt"));
    }

    private String generateFileName(String originalFileName) {
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new InvalidFileFormatException();
        }
        return UUID.randomUUID() + "_" + originalFileName;
    }

}
