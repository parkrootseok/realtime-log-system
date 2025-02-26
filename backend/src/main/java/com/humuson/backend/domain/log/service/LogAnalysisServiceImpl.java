package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogAnalysisServiceImpl implements LogAnalysisService {

    @Override
    public Map<Level, Long> getLogsCountByLevel(List<LogEntity> logs, String levelString) {
        List<Level> parsedLevels = Level.parseLevels(levelString);
        return logs.stream()
                .filter(log -> parsedLevels.contains(log.getLevel()))
                .collect(Collectors.groupingBy(LogEntity::getLevel, Collectors.counting()));
    }

    @Override
    public List<LogEntity> getLogsFilterByLevel(List<LogEntity> logs, String levelString)  {
        List<Level> parsedLevels = Level.parseLevels(levelString);
        return logs.stream()
                .filter(log -> parsedLevels.contains(log.getLevel()))
                .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp()))
                .toList();
    }

    @Override
    public Map<String, Map<Level, Long>> getLogsGroupByMinute(List<LogEntity> logs) {
        return logs.stream()
                .collect(Collectors.groupingBy(
                        this::extractMinute, java.util.TreeMap::new, Collectors.groupingBy(LogEntity::getLevel, Collectors.counting())
                ));
    }

    private String extractMinute(LogEntity log) {
        return log.getTimestamp().substring(0, 16);
    }

}
