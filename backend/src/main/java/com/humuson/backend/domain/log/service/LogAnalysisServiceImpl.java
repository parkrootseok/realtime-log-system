package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 로그 분석 서비스 구현체
 * - 로그 레벨별 개수 분석
 * - 특정 로그 레벨 필터링
 * - 로그를 분(minute) 단위로 그룹화
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogAnalysisServiceImpl implements LogAnalysisService {

    /**
     * 로그 데이터를 기반으로 특정 레벨별 로그 개수를 반환
     *
     * @param logs        분석할 로그 목록
     * @param parsedLevels 분석할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @return 로그 레벨별 개수를 매핑한 Map
     */
    @Override
    public Map<Level, Long> getLogsCountByLevel(List<LogEntity> logs, List<Level> parsedLevels) {
        return logs.stream()
                .filter(log -> parsedLevels.contains(log.getLevel())) // 주어진 레벨 목록과 일치하는 로그만 필터링
                .collect(Collectors.groupingBy(LogEntity::getLevel, Collectors.counting())); // 레벨별 개수 집계
    }

    /**
     * 특정 로그 레벨에 해당하는 로그만 필터링하여 반환
     *
     * @param logs        필터링할 로그 목록
     * @param levelString 필터링할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @return 필터링된 로그 목록 (최신순 정렬)
     */
    @Override
    public List<LogEntity> getLogsFilterByLevel(List<LogEntity> logs, String levelString) {
        List<Level> parsedLevels = Level.parseLevels(levelString);
        return logs.stream()
                .filter(log -> parsedLevels.contains(log.getLevel())) // 주어진 레벨 목록과 일치하는 로그만 필터링
                .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp())) // 최신 로그 순으로 정렬
                .toList();
    }

    /**
     * 로그를 분(minute) 단위로 그룹화하여 반환
     *
     * @param logs 그룹화할 로그 목록
     * @return 시간(분)별 로그 개수를 매핑한 Map
     */
    @Override
    public Map<String, Map<Level, Long>> getLogsGroupByMinute(List<LogEntity> logs) {
        return logs.stream()
                .collect(Collectors.groupingBy(
                        this::extractMinute, // 분 단위로 로그 그룹화
                        java.util.TreeMap::new, // 정렬된 TreeMap 사용
                        Collectors.groupingBy(LogEntity::getLevel, Collectors.counting()) // 레벨별 로그 개수 집계
                ));
    }

    /**
     * 로그의 타임스탬프에서 분(minute) 단위로 변환
     *
     * @param log 변환할 로그 엔터티
     * @return "yyyy-MM-dd HH:mm" 형식의 문자열 (분 단위)
     */
    private String extractMinute(LogEntity log) {
        return log.getTimestamp().substring(0, 16);
    }

}
