package com.humuson.backend.global.exception;

public class LogParsingException extends BaseException{

    public LogParsingException() {
        super(ErrorCode.LOG_PARSE_ERROR);
    }
}
