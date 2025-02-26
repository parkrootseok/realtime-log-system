package com.humuson.backend.global.handler;

import static com.humuson.backend.global.constant.Format.VALIDATED_ERROR_RESULT_FORMAT;
import static com.humuson.backend.global.exception.ErrorCode.FAIL_TO_VALIDATE;

import com.humuson.backend.global.exception.BaseException;
import com.humuson.backend.global.exception.ErrorCode;
import jakarta.validation.ConstraintViolationException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BaseException.class)
    protected ResponseEntity<Object> handleBaseException(BaseException e, WebRequest request) {
        ErrorCode errorCode = e.getErrorCode();
        URI instance = URI.create(((ServletWebRequest) request).getRequest().getRequestURI());
        return buildResponseEntity(e, errorCode.getStatus(), errorCode.getMessage(), instance);
    }

    @ExceptionHandler(RuntimeException.class)
    protected ResponseEntity<Object> handleRuntimeException(RuntimeException e, WebRequest request) {
        URI instance = URI.create(((ServletWebRequest) request).getRequest().getRequestURI());
        return buildResponseEntity(e, HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), instance);
    }

    @Override
    @Nullable
    protected ResponseEntity<Object> handleHandlerMethodValidationException(
            HandlerMethodValidationException e, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> errors = new ArrayList<>();
        e.getAllErrors().forEach(validationResult -> {
            if (validationResult instanceof FieldError) {
                FieldError fieldError = (FieldError) validationResult;
                errors.add(String.format(VALIDATED_ERROR_RESULT_FORMAT, fieldError.getDefaultMessage(), fieldError.getRejectedValue()));
            } else {
                errors.add(validationResult.getDefaultMessage());
            }
        });
        URI instance = URI.create(((ServletWebRequest) request).getRequest().getRequestURI());
        return buildResponseEntity(e, FAIL_TO_VALIDATE.getStatus(), FAIL_TO_VALIDATE.getMessage(), instance, errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException e, WebRequest request) {
        List<String> errors = new ArrayList<>();
        e.getConstraintViolations().forEach(violation ->
                errors.add(String.format(VALIDATED_ERROR_RESULT_FORMAT, violation.getMessage(), violation.getInvalidValue())));
        URI instance = URI.create(((ServletWebRequest) request).getRequest().getRequestURI());
        return buildResponseEntity(e, FAIL_TO_VALIDATE.getStatus(), FAIL_TO_VALIDATE.getMessage(), instance, errors);
    }

    private ResponseEntity<Object> buildResponseEntity(Exception e, HttpStatus status, String message, URI instance) {
        return ResponseEntity.status(status)
                .body(ErrorResponse.builder(e, status, message)
                        .title(e.getClass().getSimpleName())
                        .instance(instance)
                        .build());
    }

    private ResponseEntity<Object> buildResponseEntity(Exception e, HttpStatus status, String message, URI instance, List<String> errors) {
        return ResponseEntity.status(status)
                .body(ErrorResponse.builder(e, status, message)
                        .title(e.getClass().getSimpleName())
                        .instance(instance)
                        .property("error", errors)
                        .build());
    }

}