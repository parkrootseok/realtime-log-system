package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.dto.response.GetFilteredLogResponse;
import com.humuson.backend.domain.log.model.dto.response.GetCountLogResponse;
import com.humuson.backend.domain.log.model.dto.response.GetLogDistributionResponse;
import com.humuson.backend.domain.log.model.dto.response.UploadLogResponse;
import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.domain.log.service.LogAnalysisService;
import com.humuson.backend.domain.log.service.LogQueryService;
import com.humuson.backend.domain.log.service.LogUploadService;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * 로그 관련 UseCase
 * - 로그 레벨 분석
 * - 로그 분포 조회
 * - 최근 로그 조회
 * - 특정 레벨 로그 필터링
 * - 로그 파일 저장
 */
@Service
@RequiredArgsConstructor
public class LogUseCase {

    private final LogQueryService logQueryService; // 로그 조회 서비스
    private final LogAnalysisService logAnalysisService; // 로그 분석 서비스
    private final LogUploadService logUploadService; // 로그 업로드 서비스

    /**
     * 특정 로그 파일에서 로그 레벨별 개수를 분석
     *
     * @param levels   분석할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @return 로그 레벨별 개수를 포함한 응답 객체
     */
    public GetCountLogResponse analyzeLogLevels(String levels) {
        List<Level> parsedLevels = Level.parseLevels(levels);
        List<LogEntity> logs = logQueryService.getLogsInLevel(parsedLevels);
        Map<Level, Long> counts = logAnalysisService.getLogsCountByLevel(logs, parsedLevels);
        return GetCountLogResponse.of(
                logs.size(),
                counts.getOrDefault(Level.INFO, 0L),
                counts.getOrDefault(Level.ERROR, 0L),
                counts.getOrDefault(Level.WARN, 0L)
        );
    }

    /**
     * 특정 시간 범위 내에서 로그 분포를 조회
     *
     * @param start    시작 시간
     * @param end      종료 시간
     * @return 시간별 로그 개수를 포함한 응답 객체
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    public GetLogDistributionResponse getLogDistribution(LocalDateTime start, LocalDateTime end) throws IOException {
        List<LogEntity> logs = logQueryService.getLogsByStartAndEnd(start, end);
        Map<String, Map<Level, Long>> groupedLogs = logAnalysisService.getLogsGroupByMinute(logs);
        return GetLogDistributionResponse.of(groupedLogs);
    }

    /**
     * 특정 로그 파일에서 최신 로그를 지정된 개수만큼 조회
     *
     * @param limit    조회할 로그 개수 제한
     * @return 최신 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    public List<LogEntity> getRecentLogsByLimit(int limit) throws IOException {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "timestamp"));
        return logQueryService.getRecentLogsByLimit(pageable);
    }

    /**
     * 특정 로그 파일에서 지정된 로그 레벨에 해당하는 로그를 필터링하고 페이징 처리하여 반환
     *
     * @param levels   필터링할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @param page     페이지 번호
     * @param size     페이지 크기
     * @return 필터링된 로그 목록을 포함한 응답 객체
     */
    public GetFilteredLogResponse filterLogsByLevel(String levels, int page, int size) {
        List<Level> parsedLevels = Level.parseLevels(levels);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<LogEntity> filteredLogs = logQueryService.getPaginatedLogsInLevel(parsedLevels, pageable);
        return GetFilteredLogResponse.of(filteredLogs.getContent(), filteredLogs.getNumber(), filteredLogs.getSize(), filteredLogs.getTotalElements());
    }

    /**
     * 업로드된 로그 파일을 저장
     *
     * @param file 업로드할 로그 파일
     * @return 업로드된 로그 파일 정보 응답 객체
     */
    public UploadLogResponse saveLogFile(MultipartFile file) {
        return UploadLogResponse.of(logUploadService.saveLogFile(file));
    }

}
