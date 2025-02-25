package com.humuson.backend.application.log.service;

import com.humuson.backend.application.log.usecase.AnalysisService;
import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.domain.log.service.LogService;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisServiceImpl implements AnalysisService {

    private final LogService logService;

    @Override
    public LogAnalysisResponse analyzeLogs(String fileName, String levels) throws IOException {

        List<LogEntity> logs = logService.readLogs(fileName);
        List<Level> logLevels = getLogLevels(levels);
        Map<Level, Long> logCounts = logService.countLogs(logs, logLevels);

        return LogAnalysisResponse.of(
                logs.size(),
                logCounts.getOrDefault(Level.ERROR, 0L),
                logCounts.getOrDefault(Level.WARN, 0L)
        );

    }

    @Override
    public ErrorLogResponse getErrorLogs(String fileName, String levels) throws IOException {
        List<LogEntity> logs = logService.readLogs(fileName);
        List<Level> logLevels = getLogLevels(levels);
        return ErrorLogResponse.of(logService.filteringLogs(logs, logLevels));
    }

    private List<Level> getLogLevels(String levels) {
        return (levels != null && !levels.isEmpty()) ? Arrays.stream(levels.split(",")).map(Level::fromString).toList() : List.of(Level.ERROR, Level.WARN, Level.INFO);
    }
}
