package com.humuson.backend.domain.log.model.response;

import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ErrorLogResponse(List<String> logs) {

    public static ErrorLogResponse of(List<String> logs) {
        return ErrorLogResponse.builder()
                .logs(logs)
                .build();
    }

}
