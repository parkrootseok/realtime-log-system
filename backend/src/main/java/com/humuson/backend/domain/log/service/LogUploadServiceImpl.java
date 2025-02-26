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

/**
 * 로그 업로드 서비스 구현체
 * - 로그 파일을 저장하고 검증하는 기능을 수행
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogUploadServiceImpl implements LogUploadService {

    private final LogRepository logRepository; // 로그 파일 저장을 담당하는 저장소

    /**
     * 업로드된 로그 파일을 저장
     *
     * @param file 업로드할 로그 파일
     * @return 저장된 파일의 이름
     * @throws InvalidFileFormatException 지원되지 않는 파일 형식일 경우 발생
     * @throws FileUploadException 파일 저장 실패 시 발생
     */
    @Override
    public String saveLogFile(MultipartFile file) {

        if (!isValidLogFile(file)) {
            throw new InvalidFileFormatException();
        }

        String newFileName = generateFileName(file.getOriginalFilename()); // UUID 기반 새로운 파일명 생성

        try {
            return logRepository.saveLog(file, newFileName); // 새로운 파일명으로 저장
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new FileUploadException();
        }
    }

    /**
     * 파일의 확장자가 .log 또는 .txt인지 검증
     *
     * @param file 검증할 파일
     * @return 유효한 파일이면 true, 그렇지 않으면 false
     */
    private boolean isValidLogFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName != null && fileName.contains(".") && (fileName.endsWith(".log") || fileName.endsWith(".txt"));
    }

    /**
     * 업로드된 파일명을 UUID 기반으로 변환
     *
     * @param originalFileName 원본 파일명
     * @return UUID 기반으로 생성된 새로운 파일명
     * @throws InvalidFileFormatException 파일명이 유효하지 않을 경우 발생
     */
    private String generateFileName(String originalFileName) {
        if (originalFileName == null || !originalFileName.contains(".")) {
            throw new InvalidFileFormatException();
        }
        return UUID.randomUUID() + "_" + originalFileName;
    }

}
