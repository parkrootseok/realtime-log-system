package com.humuson.backend.global.exception;

/**
 * 로그 파일이 존재하지 않을 때 발생하는 예외
 */
public class LogFileNotFoundException extends BaseException {

    public LogFileNotFoundException() {
        super(ErrorCode.LOG_FILE_NOT_FOUND);
    }

}
