package com.humuson.backend.domain.log.model.dto.response;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record GetFilteredLogResponse(List<LogEntity> logs) {

    public static GetFilteredLogResponse of(List<LogEntity> logs) {
        return GetFilteredLogResponse.builder()
                .logs(logs)
                .build();
    }

}
