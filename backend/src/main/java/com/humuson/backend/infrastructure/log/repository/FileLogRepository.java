package com.humuson.backend.infrastructure.log.repository;

import static com.humuson.backend.global.constant.Format.TIMESTAMP_FORMAT;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.global.util.LogParseUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Repository
public class FileLogRepository implements LogRepository {

    private static final Path DEFAULT_LOG_PATH = Path.of("logs/app.log");
    private static final Path LOG_DIRECTORY = Path.of("logs/");

    @Override
    public List<LogEntity> readLogs(String fileName) throws IOException {

        Path logFilePath = validateAndGetLogFilePath(fileName);
        try (Stream<String> lines = Files.lines(logFilePath)) {
            return lines
                    .map(LogParseUtil::parseLog)
                    .filter(Objects::nonNull)
                    .map(LogEntity::new)
                    .toList();
        }
    }

    @Override
    public List<LogEntity> readLastNLogs(String fileName, int limit) throws IOException {
        Path logFilePath = validateAndGetLogFilePath(fileName);
        try (Stream<String> lines = Files.lines(logFilePath)) {
            long totalLines = Files.lines(logFilePath).count();
            return lines
                    .skip(Math.max(0, totalLines - limit))
                    .map(LogParseUtil::parseLog)
                    .filter(Objects::nonNull)
                    .map(LogEntity::new)
                    .toList();
        }
    }

    public List<LogEntity> readLogsByTimeRange(String fileName, LocalDateTime startTime, LocalDateTime endTime) throws IOException {
        Path logFilePath = validateAndGetLogFilePath(fileName);
        try (Stream<String> lines = Files.lines(logFilePath)) {
            return lines
                    .map(LogParseUtil::parseLog)
                    .filter(Objects::nonNull)
                    .filter(parsedLog -> isWithinTimeRange(parsedLog.get("timestamp"), startTime, endTime))
                    .map(LogEntity::new)
                    .toList();
        }
    }

    private boolean isWithinTimeRange(String timestampStr, LocalDateTime startTime, LocalDateTime endTime) {
        try {
            LocalDateTime logTime = LocalDateTime.parse(timestampStr, TIMESTAMP_FORMAT);
            return (logTime.isAfter(startTime) || logTime.isEqual(startTime)) && (logTime.isBefore(endTime) || logTime.isEqual(endTime));
        } catch (Exception e) {
            return false;
        }
    }

    private Path validateAndGetLogFilePath(String fileName) throws IOException {

        Path logFilePath = (fileName != null && !fileName.isEmpty()) ? Path.of("logs", fileName) : DEFAULT_LOG_PATH;

        if (!Files.exists(logFilePath)) {
            throw new IOException("로그 파일을 찾을 수 없습니다: " + logFilePath);
        }

        return logFilePath;

    }

    @Override
    public String saveLog(MultipartFile file, String newFileName) throws IOException {

        if (!Files.exists(LOG_DIRECTORY)) {
            Files.createDirectories(LOG_DIRECTORY);
        }

        Path destination = LOG_DIRECTORY.resolve(newFileName);
        Files.copy(file.getInputStream(), destination);
        return newFileName;

    }

}
