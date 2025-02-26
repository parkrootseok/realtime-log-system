package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.dto.response.LogDistributionResponseDto;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface AnalysisService {

    LogAnalysisResponse getLogsCountByLevel(String fileName, String levels) throws IOException;
    List<LogEntity> getLogsByLimit(String fileName, int limit) throws IOException;
    List<LogDistributionResponseDto> getLogsGroupByMinute(String fileName, LocalDateTime start, LocalDateTime end) throws IOException;
    ErrorLogResponse getLogsByLevel(String fileName, String levels) throws IOException;

}
