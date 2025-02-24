package com.humuson.backend.domain.log.model.response;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record LogAnalysisResponse(int totalLogsCount, long errorLogsCount) {

    public static LogAnalysisResponse of(int totalLogsCount, long errorLogsCount) {
        return LogAnalysisResponse.builder()
                .totalLogsCount(totalLogsCount)
                .errorLogsCount(errorLogsCount)
                .build();
    }

}
