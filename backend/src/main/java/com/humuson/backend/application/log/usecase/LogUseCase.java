package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.dto.response.GetFilteredLogResponse;
import com.humuson.backend.domain.log.model.dto.response.GetCountLogResponse;
import com.humuson.backend.domain.log.model.dto.response.GetLogDistributionResponse;
import com.humuson.backend.domain.log.model.dto.response.UploadLogResponse;
import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.domain.log.service.LogAnalysisService;
import com.humuson.backend.domain.log.service.LogQueryService;
import com.humuson.backend.domain.log.service.LogUploadService;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LogUseCase {

    private final LogQueryService logQueryService;
    private final LogAnalysisService logAnalysisService;
    private final LogUploadService logUploadService;

    public GetCountLogResponse analyzeLogLevels(String fileName, String levels) throws IOException {
        List<LogEntity> logs = logQueryService.getLogs(fileName);
        Map<Level, Long> counts = logAnalysisService.getLogsCountByLevel(logs, levels);
        return GetCountLogResponse.of(
                logs.size(),
                counts.getOrDefault(Level.INFO, 0L),
                counts.getOrDefault(Level.ERROR, 0L),
                counts.getOrDefault(Level.WARN, 0L)
        );
    }

    public GetLogDistributionResponse groupLogsByMinute(String fileName, LocalDateTime start, LocalDateTime end) throws IOException {
        List<LogEntity> logs = logQueryService.getLogsByStartAndEnd(fileName, start, end);
        Map<String, Map<Level, Long>> groupedLogs = logAnalysisService.getLogsGroupByMinute(logs);
        return GetLogDistributionResponse.of(groupedLogs);
    }

    public List<LogEntity> getRecentLogsByLimit(String fileName, int limit) throws IOException {
        return logQueryService.getRecentLogsByLimit(fileName, limit);
    }

    public GetFilteredLogResponse filterLogsByLevel(String fileName, String levels) throws IOException {
        List<LogEntity> logs = logQueryService.getLogs(fileName);
        List<LogEntity> filteredLogs = logAnalysisService.getLogsFilterByLevel(logs, levels);
        return GetFilteredLogResponse.of(filteredLogs);
    }

    public UploadLogResponse saveUploadedLog(MultipartFile fileName) {
        return UploadLogResponse.of(logUploadService.saveUploadedLog(fileName));
    }

}
