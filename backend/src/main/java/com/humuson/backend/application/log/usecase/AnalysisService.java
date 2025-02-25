package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import java.io.IOException;

public interface AnalysisService {

    LogAnalysisResponse analyzeLogs(String fileName) throws IOException;
    ErrorLogResponse getErrorLogs(String fileName, String levels) throws IOException;

}
