package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

@Service
@RequiredArgsConstructor
public class LogUseCase {

    private final AnalysisService analysisService;
    private final UploadService uploadService;

    public LogAnalysisResponse analyzeLogs(String fileName, String levels) throws IOException {
        return analysisService.analyzeLogs(fileName, levels);
    }

    public ErrorLogResponse getErrorLogs(String fileName, String levels) throws IOException {
        return analysisService.getErrorLogs(fileName, levels);
    }

    public String uploadLog(MultipartFile fileName) {
        return uploadService.uploadLog(fileName);
    }

}
