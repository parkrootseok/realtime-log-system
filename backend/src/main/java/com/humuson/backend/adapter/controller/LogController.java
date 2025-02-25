package com.humuson.backend.adapter.controller;

import com.humuson.backend.application.log.usecase.LogUseCase;
import com.humuson.backend.domain.log.model.dto.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.dto.response.ErrorLogResponse;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.global.model.dto.Result;
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

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<LogEntity> streamLogs() {
        return logUseCase.streamLogs();
    }

    @GetMapping("/analyze")
    public Result<LogAnalysisResponse> getLogStats(
            @RequestParam(required = false) String fileName
    ) throws IOException {
        return Result.of(logUseCase.analyzeLogs(fileName));
    }

    @GetMapping("/errors")
    public Result<ErrorLogResponse> getErrorLogs(
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) String levels
    ) throws IOException {
        return Result.of(logUseCase.getErrorLogs(fileName, levels));
    }

    @PostMapping("/upload")
    public Result<String> uploadLogFile(@RequestParam("file") MultipartFile file) {
        return Result.of(logUseCase.uploadLog(file));
    }

}
