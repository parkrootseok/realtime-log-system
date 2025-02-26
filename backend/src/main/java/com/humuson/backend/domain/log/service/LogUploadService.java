package com.humuson.backend.domain.log.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * 로그 업로드 서비스 인터페이스
 * - 로그 파일을 저장하는 기능을 정의
 */
public interface LogUploadService {

    /**
     * 로그 파일을 저장하는 메서드
     *
     * @param file 업로드할 로그 파일 (Multipart 요청)
     * @return 저장된 파일의 이름
     */
    String saveLogFile(MultipartFile file);

}
