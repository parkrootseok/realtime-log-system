package com.humuson.backend.domain.log.controller;

import com.humuson.backend.domain.log.model.response.LogAnalysisResponse;
import com.humuson.backend.domain.log.model.response.ErrorLogResponse;
import com.humuson.backend.global.model.dto.Result;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/logs")
public class LogController {

    private static final Path LOG_FILE_PATH = Path.of("logs/app.log");

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamLogs() {
        return Flux.interval(Duration.ofSeconds(1))
                .flatMap(tick -> Flux.fromStream(readLastLines(20)))
                .map(line -> line + "\n");
    }

    private Stream<String> readLastLines(int lines) {
        try (Stream<String> stream = Files.lines(LOG_FILE_PATH)) {
            long totalLines = Files.lines(LOG_FILE_PATH).count();
            return stream.skip(Math.max(0, totalLines - lines))
                         .sorted(Comparator.reverseOrder())
                         .toList()
                         .stream();
        } catch (Exception e) {
            return Stream.of("No logs available...").toList().stream();
        }
    }

    @GetMapping("/analyze")
    public Result<LogAnalysisResponse> getLogStats(@RequestParam(required = false) String fileName) throws IOException {

        Path logFilePath = fileName != null ? Path.of("logs", fileName) : LOG_FILE_PATH;
        if (!Files.exists(logFilePath)) {
            throw new FileNotFoundException("로그 파일을 찾을 수 없습니다: " + logFilePath);
        }

        try (Stream<String> logStream = Files.lines(logFilePath)) {

            long totalLines = 0;
            long errorCount = 0;

            for (String line : (Iterable<String>) logStream::iterator) {
                totalLines++;
                if (line.contains("ERROR")) {
                    errorCount++;
                }
            }

            return Result.of(LogAnalysisResponse.of(totalLines, errorCount));

        }

    }

    @GetMapping("/errors")
    public Result<ErrorLogResponse> getErrorLogs(@RequestParam(required = false) String fileName, @RequestParam(required = false) String levels) throws IOException {
        Path logFilePath = fileName != null ? Path.of("logs", fileName) : LOG_FILE_PATH;
        List<String> logLevels = levels != null ? Arrays.asList(levels.split(",")) : Arrays.asList("ERROR", "WARN", "INFO");
        List<String> logs = Files.lines(logFilePath).filter(line -> logLevels.stream().anyMatch(level -> line.toUpperCase().contains(level.toUpperCase()))).toList();
        return Result.of(
                ErrorLogResponse.of(logs)
        );
    }

    @PostMapping("/upload")
    public Result<String> uploadLogFile(@RequestParam("file") MultipartFile file) {
        try {
            if (!file.isEmpty() && (file.getOriginalFilename().endsWith(".log") || file.getOriginalFilename().endsWith(".txt"))) {
                String newFileName = UUID.randomUUID() + ".log";
                Path destination = LOG_FILE_PATH.resolveSibling(newFileName);
                Files.copy(file.getInputStream(), destination);
                return Result.of(newFileName);
            } else {
                return Result.of(null);
            }
        } catch (IOException e) {
            return Result.of(null);
        }
    }

}
