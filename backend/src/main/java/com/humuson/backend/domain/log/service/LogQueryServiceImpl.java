package com.humuson.backend.domain.log.service;

import static com.humuson.backend.global.constant.Format.TIMESTAMP_FORMAT;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.infrastructure.log.repository.MongoLogRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * 로그 조회 서비스 구현체
 * - 데이터 저장소에서 로그를 검색하는 기능을 수행
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogQueryServiceImpl implements LogQueryService {

    private final MongoLogRepository logRepository;

    /**
     * 특정 로그 파일에서 모든 로그를 조회
     *
     * @return 로그 목록
     */
    @Override
    public List<LogEntity> getLogs() {
        return logRepository.findAll();
    }

    @Override
    public List<LogEntity> getLogsByLevel(List<Level> levels) {
        return logRepository.findAllByLevelIn(levels);
    }

    @Override
    public Page<LogEntity> getLogsByLevelOrderByTimeStampDesc(List<Level> levels, Pageable pageable) {
        return logRepository.findAllByLevelIn(levels, pageable);
    }

    /**
     * 특정 로그 파일에서 최신 로그를 지정된 개수만큼 조회
     *
     * @return 최신 로그 목록 (최신순 정렬)
     */
    @Override
    public List<LogEntity> getRecentLogsByLimit(Pageable pageable) {
        return logRepository.findAll(pageable).getContent();
    }

    /**
     * 특정 로그 파일에서 지정된 시간 범위 내의 로그를 조회
     *
     * @param start    조회 시작 시간
     * @param end      조회 종료 시간
     * @return 시간 범위 내의 로그 목록
     */
    @Override
    public List<LogEntity> getLogsByStartAndEnd(LocalDateTime start, LocalDateTime end) {
        return logRepository.findAllByTimestampBetween(start.format(TIMESTAMP_FORMAT), end.format(TIMESTAMP_FORMAT));
    }

}
