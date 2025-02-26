package com.humuson.backend.global.exception;

public class FileUploadException extends BaseException {

    public FileUploadException() {
        super(ErrorCode.FILE_UPLOAD_ERROR);
    }

}
