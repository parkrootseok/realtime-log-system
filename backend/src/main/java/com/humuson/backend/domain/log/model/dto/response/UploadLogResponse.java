package com.humuson.backend.domain.log.model.dto.response;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record UploadLogResponse(String fileName) {

    public static UploadLogResponse of(String message) {
        return UploadLogResponse.builder()
                .fileName(message)
                .build();
    }

}
