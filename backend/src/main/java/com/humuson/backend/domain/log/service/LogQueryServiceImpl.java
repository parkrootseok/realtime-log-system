package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.infrastructure.log.repository.LogRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogQueryServiceImpl implements LogQueryService {

    private final LogRepository logRepository;

    @Override
    public List<LogEntity> getLogs(String fileName) throws IOException {
        return logRepository.readLogs(fileName);
    }

    @Override
    public List<LogEntity> getRecentLogsByLimit(String fileName, int limit) throws IOException {
        return logRepository.readLastNLogs(fileName, limit)
                .stream()
                .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp()))
                .toList();
    }

    @Override
    public List<LogEntity> getLogsByStartAndEnd(String fileName, LocalDateTime start, LocalDateTime end) throws IOException {
        return logRepository.readLogsByTimeRange(fileName, start, end);
    }

}
