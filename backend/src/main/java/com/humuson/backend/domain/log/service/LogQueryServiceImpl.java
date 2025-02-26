package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.infrastructure.log.repository.LogRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 로그 조회 서비스 구현체
 * - 데이터 저장소에서 로그를 검색하는 기능을 수행
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogQueryServiceImpl implements LogQueryService {

    private final LogRepository logRepository; // 로그 데이터를 읽어오는 저장소

    /**
     * 특정 로그 파일에서 모든 로그를 조회
     *
     * @param fileName 조회할 로그 파일 이름
     * @return 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @Override
    public List<LogEntity> getLogs(String fileName) throws IOException {
        return logRepository.readLogs(fileName);
    }

    /**
     * 특정 로그 파일에서 최신 로그를 지정된 개수만큼 조회
     *
     * @param fileName 조회할 로그 파일 이름
     * @param limit    조회할 로그 개수 제한
     * @return 최신 로그 목록 (최신순 정렬)
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @Override
    public List<LogEntity> getRecentLogsByLimit(String fileName, int limit) throws IOException {
        return logRepository.readLastNLogs(fileName, limit)
                .stream()
                .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp())) // 최신 로그 순 정렬
                .toList();
    }

    /**
     * 특정 로그 파일에서 지정된 시간 범위 내의 로그를 조회
     *
     * @param fileName 조회할 로그 파일 이름
     * @param start    조회 시작 시간
     * @param end      조회 종료 시간
     * @return 시간 범위 내의 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @Override
    public List<LogEntity> getLogsByStartAndEnd(String fileName, LocalDateTime start, LocalDateTime end) throws IOException {
        return logRepository.readLogsByTimeRange(fileName, start, end);
    }

}
