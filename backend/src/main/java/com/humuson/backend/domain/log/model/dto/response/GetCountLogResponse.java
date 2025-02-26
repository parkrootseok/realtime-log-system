package com.humuson.backend.domain.log.model.dto.response;

import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record GetCountLogResponse(long totalLogsCount, long infoLogsCount, long errorLogsCount, long warningLogsCount) {

    public static GetCountLogResponse of(long totalLogsCount, long infoLogsCount, long errorLogsCount, long warningLogsCount) {
        return GetCountLogResponse.builder()
                .totalLogsCount(totalLogsCount)
                .infoLogsCount(infoLogsCount)
                .errorLogsCount(errorLogsCount)
                .warningLogsCount(warningLogsCount)
                .build();
    }

}
