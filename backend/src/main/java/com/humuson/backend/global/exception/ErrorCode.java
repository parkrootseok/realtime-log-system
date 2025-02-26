package com.humuson.backend.global.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public enum ErrorCode {

    /**
     * [400 Bad Request]
     * - 응답 상태 코드는 서버가 클라이언트 오류를 감지해 요청 불가
     */
    FAIL_TO_VALIDATE(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    INVALID_FILE_FORMAT(HttpStatus.BAD_REQUEST, "잘못된 파일 형식이거나 빈 파일입니다."),
    /**
     * [401 UnAuthorized]
     * - 요청된 리소스에 대한 유효한 인증 자격 증명이 없음
     */

    /**
     * [403 Forbidden]
     * - 요청한 자원에 대해 권한 없음
     */

    /**
     * [404 Not Found]
     * - 존재하지 않는 자원
     */
    NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 자원입니다."),


    /**
     * [500 INTERNAL_SERVER_ERROR]
     * - 서버 오류
     */
    LOG_PARSE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "로그 파싱 중 오류가 발생했습니다."),
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR , "파일 업로드 중 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String message;


}

