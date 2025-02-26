package com.humuson.backend.adapter.controller;

import com.humuson.backend.application.log.usecase.LogUseCase;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.global.model.dto.Result;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogUseCase logUseCase;

    @GetMapping("/analyze")
    public Result<LogAnalysisResponse> analyzeLogs(
            @RequestParam(defaultValue = "app.log") String fileName,
            @RequestParam(required = false) String levels
    ) throws IOException {
        return Result.of(logUseCase.analyzeLogs(fileName, levels));
    }

    @GetMapping("/errors")
    public Result<ErrorLogResponse> getErrorLogs(
            @RequestParam(defaultValue = "app.log") String fileName,
            @RequestParam(required = false) String levels
    ) throws IOException {
        return Result.of(logUseCase.getErrorLogs(fileName, levels));
    }

    @PostMapping("/upload")
    public Result<String> uploadLogFile(@RequestParam("file") MultipartFile file) {
        return Result.of(logUseCase.uploadLog(file));
    }

}
