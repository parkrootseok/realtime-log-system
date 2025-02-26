package com.humuson.backend.domain.log.model.dto.response;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record GetFilteredLogResponse(List<LogEntity> logs, int page, int size, long totalElements) {

    public static GetFilteredLogResponse of(List<LogEntity> logs, int page, int size, int totalElements) {
        return GetFilteredLogResponse.builder()
                .logs(logs)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .build();
    }

}
