package com.humuson.backend.global.exception;

public class InvalidFileFormatException extends BaseException {

    public InvalidFileFormatException() {
        super(ErrorCode.INVALID_FILE_FORMAT);
    }

}
