package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.dto.response.LogDistributionResponseDto;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LogUseCase {

    private final AnalysisService analysisService;
    private final UploadService uploadService;

    public LogAnalysisResponse getLogsCountByLevel(String fileName, String levels) throws IOException {
        return analysisService.getLogsCountByLevel(fileName, levels);
    }

    public List<LogDistributionResponseDto> getLogsGroupByMinute(String fileName, LocalDateTime start, LocalDateTime end) throws IOException {
        return analysisService.getLogsGroupByMinute(fileName, start, end);
    }

    public List<LogEntity> getLastNLogs(String fileName, int limit) throws IOException {
        return analysisService.getLogsByLimit(fileName, limit);
    }

    public ErrorLogResponse getLogsByLevel(String fileName, String levels) throws IOException {
        return analysisService.getLogsByLevel(fileName, levels);
    }

    public String uploadLog(MultipartFile fileName) {
        return uploadService.uploadLog(fileName);
    }

}
