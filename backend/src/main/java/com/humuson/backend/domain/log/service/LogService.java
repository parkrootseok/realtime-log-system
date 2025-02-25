package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.humuson.backend.infrastructure.log.repository.LogRepository;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LogService {

    private final LogRepository logRepository;

    public List<LogEntity> readLogs(String fileName) throws IOException {
        return logRepository.readLogs(fileName);
    }

    public List<LogEntity> readLastNLogs(String fileName, int limit) throws IOException {
        return logRepository.readLastNLogs(fileName, limit)
                .stream()
                .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp()))
                .toList();
    }

    public String saveLog(MultipartFile file) throws IOException {
        if (file.isEmpty() || !isValidLogFile(file)) {
            throw new IOException("잘못된 파일 형식이거나 빈 파일입니다.");
        }
        return logRepository.saveLog(file);
    }

    private boolean isValidLogFile(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName != null && (fileName.endsWith(".log") || fileName.endsWith(".txt"));
    }

    public Map<Level, Long> countLogs(List<LogEntity> logs, List<Level> logLevels) {
        return logs.stream()
                .filter(log -> logLevels.contains(log.getLevel()))
                .collect(Collectors.groupingBy(LogEntity::getLevel, Collectors.counting()));
    }

    public List<LogEntity> filteringLogs(List<LogEntity> logs, List<Level> levels) {
        return logs.stream()
                .filter(log -> levels.contains(log.getLevel()))
                .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp()))
                .toList();
    }

}
