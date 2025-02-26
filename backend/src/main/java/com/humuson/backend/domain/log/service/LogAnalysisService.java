package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 로그 분석을 위한 서비스 인터페이스
 * - 로그 레벨별 개수 분석
 * - 특정 로그 레벨 필터링
 * - 로그를 분 단위로 그룹화
 */
public interface LogAnalysisService {

    /**
     * 로그 데이터를 기반으로 특정 레벨별 로그 개수를 반환
     *
     * @param logs   분석할 로그 목록
     * @param levels 분석할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @return 로그 레벨별 개수를 매핑한 Map
     */
    Map<Level, Long> getLogsCountByLevel(List<LogEntity> logs, String levels);

    /**
     * 특정 로그 레벨에 해당하는 로그만 필터링하여 반환
     *
     * @param logs   필터링할 로그 목록
     * @param levels 필터링할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @return 필터링된 로그 목록
     */
    List<LogEntity> getLogsFilterByLevel(List<LogEntity> logs, String levels);

    /**
     * 로그를 분(minute) 단위로 그룹화하여 반환
     *
     * @param logs 그룹화할 로그 목록
     * @return 시간(분)별 로그 개수를 매핑한 Map
     */
    Map<String, Map<Level, Long>> getLogsGroupByMinute(List<LogEntity> logs);

}
