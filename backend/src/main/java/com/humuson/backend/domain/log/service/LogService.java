package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.util.List;
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

    public long countErrorLog(List<LogEntity> logs) {
        return logs.stream().filter(LogEntity::isError).count();
    }

    public List<LogEntity> filteringLogs(List<LogEntity> logs, List<Level> levels) {
        return logs.stream()
                .filter(log -> levels.contains(log.getLevel()))
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

}
