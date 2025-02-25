package com.humuson.backend.domain.log.model.dto.response;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record LogAnalysisResponse(long totalLogsCount, long errorLogsCount, long warningLogsCount) {

    public static LogAnalysisResponse of(long totalLogsCount, long errorLogsCount, long warningLogsCount) {
        return LogAnalysisResponse.builder()
                .totalLogsCount(totalLogsCount)
                .errorLogsCount(errorLogsCount)
                .warningLogsCount(warningLogsCount)
                .build();
    }

}
