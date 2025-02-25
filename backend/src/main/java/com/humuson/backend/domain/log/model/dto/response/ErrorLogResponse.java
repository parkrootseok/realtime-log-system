package com.humuson.backend.domain.log.model.dto.response;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record ErrorLogResponse(List<LogEntity> logs) {

    public static ErrorLogResponse of(List<LogEntity> logs) {
        return ErrorLogResponse.builder()
                .logs(logs)
                .build();
    }

}
