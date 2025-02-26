package com.humuson.backend.infrastructure.log.repository;

import static com.humuson.backend.global.constant.Format.TIMESTAMP_FORMAT;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.global.exception.LogFileNotFoundException;
import com.humuson.backend.global.util.LogParseUtil;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.web.multipart.MultipartFile;

/**
 * 파일 기반 로그 저장소 구현체
 * - 로그 파일을 읽고 저장하는 기능을 수행
 */
@Slf4j
@Repository
public class FileLogRepository implements LogRepository {

    private static final Path DEFAULT_LOG_PATH = Path.of("logs/app.log"); // 기본 로그 파일 경로
    private static final Path LOG_DIRECTORY = Path.of("logs/"); // 로그 저장 디렉터리

    /**
     * 특정 로그 파일에서 모든 로그를 읽어 반환
     *
     * @param fileName 로그 파일 이름
     * @return 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @Override
    public List<LogEntity> readLogs(String fileName) throws IOException {
        Path logFilePath = validateAndGetLogFilePath(fileName);
        try (Stream<String> lines = Files.lines(logFilePath)) {
            return lines
                    .map(LogParseUtil::parseLog) // 로그 파싱
                    .filter(Objects::nonNull)
                    .map(LogEntity::new) // 로그 엔터티 변환
                    .toList();
        }
    }

    /**
     * 특정 로그 파일에서 최신 로그를 지정된 개수만큼 읽어 반환
     *
     * @param fileName 로그 파일 이름
     * @param limit    조회할 로그 개수 제한
     * @return 최신 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @Override
    public List<LogEntity> readLastNLogs(String fileName, int limit) throws IOException {
        Path logFilePath = validateAndGetLogFilePath(fileName);
        try (Stream<String> lines = Files.lines(logFilePath)) {
            long totalLines = Files.lines(logFilePath).count();
            return lines
                    .skip(Math.max(0, totalLines - limit)) // 최신 로그 개수 제한
                    .map(LogParseUtil::parseLog)
                    .filter(Objects::nonNull)
                    .map(LogEntity::new)
                    .toList();
        }
    }

    /**
     * 특정 시간 범위 내의 로그를 조회
     *
     * @param fileName  로그 파일 이름
     * @param startTime 조회 시작 시간
     * @param endTime   조회 종료 시간
     * @return 시간 범위 내의 로그 목록
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @Override
    public List<LogEntity> readLogsByTimeRange(String fileName, LocalDateTime startTime, LocalDateTime endTime) throws IOException {
        Path logFilePath = validateAndGetLogFilePath(fileName);
        try (Stream<String> lines = Files.lines(logFilePath)) {
            return lines
                    .map(LogParseUtil::parseLog)
                    .filter(Objects::nonNull)
                    .filter(parsedLog -> isWithinTimeRange(parsedLog.get("timestamp"), startTime, endTime))
                    .map(LogEntity::new)
                    .toList();
        }
    }

    /**
     * 주어진 타임스탬프가 특정 시간 범위 내에 있는지 확인
     *
     * @param timestampStr 로그 타임스탬프 문자열
     * @param startTime    시작 시간
     * @param endTime      종료 시간
     * @return 시간 범위 내에 있으면 true, 그렇지 않으면 false
     */
    private boolean isWithinTimeRange(String timestampStr, LocalDateTime startTime, LocalDateTime endTime) {
        try {
            LocalDateTime logTime = LocalDateTime.parse(timestampStr, TIMESTAMP_FORMAT);
            return (logTime.isAfter(startTime) || logTime.isEqual(startTime)) &&
                    (logTime.isBefore(endTime) || logTime.isEqual(endTime));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 주어진 로그 파일 이름을 검증하고 해당 경로를 반환
     *
     * @param fileName 로그 파일 이름
     * @return 검증된 로그 파일 경로
     * @throws LogFileNotFoundException 파일이 존재하지 않을 경우 예외 발생
     */
    private Path validateAndGetLogFilePath(String fileName) {
        Path logFilePath = (fileName != null && !fileName.isEmpty()) ? Path.of("logs", fileName) : DEFAULT_LOG_PATH;

        if (!Files.exists(logFilePath)) {
            throw new LogFileNotFoundException();
        }

        return logFilePath;
    }

    /**
     * 업로드된 로그 파일을 저장
     *
     * @param file        업로드할 로그 파일
     * @param newFileName 저장할 새로운 파일 이름
     * @return 저장된 파일의 이름
     * @throws IOException 파일 저장 중 오류 발생 시 예외 발생
     */
    @Override
    public String saveLog(MultipartFile file, String newFileName) throws IOException {
        if (!Files.exists(LOG_DIRECTORY)) {
            Files.createDirectories(LOG_DIRECTORY); // 로그 디렉터리가 없으면 생성
        }

        Path destination = LOG_DIRECTORY.resolve(newFileName);
        Files.copy(file.getInputStream(), destination);
        return newFileName;
    }
}
