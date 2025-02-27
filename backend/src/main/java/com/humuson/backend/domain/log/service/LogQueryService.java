package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * 로그 조회 서비스 인터페이스
 * - 로그 파일에서 로그를 조회하는 기능을 정의
 */
public interface LogQueryService {

    /**
     * 특정 로그 파일에서 모든 로그를 조회
     *
     * @return 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    List<LogEntity> getLogs();

    List<LogEntity> getLogsByLevel(List<Level> levels);

    Page<LogEntity> getLogsByLevelOrderByTimeStampDesc(List<Level> levels, Pageable pageable);

    /**
     * 특정 로그 파일에서 최신 로그를 지정된 개수만큼 조회
     *
     * @return 최신 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    List<LogEntity> getRecentLogsByLimit(Pageable pageable) throws IOException;

    /**
     * 특정 로그 파일에서 지정된 시간 범위 내의 로그를 조회
     *
     * @param start    조회 시작 시간
     * @param end      조회 종료 시간
     * @return 시간 범위 내의 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    List<LogEntity> getLogsByStartAndEnd(LocalDateTime start, LocalDateTime end) throws IOException;

}
