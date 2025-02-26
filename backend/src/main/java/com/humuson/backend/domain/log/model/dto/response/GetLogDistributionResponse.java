package com.humuson.backend.domain.log.model.dto.response;

import com.humuson.backend.domain.log.model.entity.Level;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record GetLogDistributionResponse(Map<String, Map<Level, Long>> distribution) {

    public static GetLogDistributionResponse of(Map<String, Map<Level, Long>> distribution) {
        return GetLogDistributionResponse.builder()
                .distribution(distribution)
                .build();
    }

}
