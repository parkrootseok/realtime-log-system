package com.humuson.backend.domain.log.model.response;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record LogAnalysisResponse(long totalLogsCount, long errorLogsCount) {

    public static LogAnalysisResponse of(long totalLogsCount, long errorLogsCount) {
        return LogAnalysisResponse.builder()
                .totalLogsCount(totalLogsCount)
                .errorLogsCount(errorLogsCount)
                .build();
    }

}
