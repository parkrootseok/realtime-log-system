package com.humuson.backend.infrastructure.log.repository;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.global.exception.LogFileNotFoundException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/**
 * 로그 저장소 인터페이스
 * - 로그 데이터를 읽고 저장하는 기능을 정의
 */
public interface LogRepository {

//    /**
//     * 특정 로그 파일에서 모든 로그를 읽어 반환
//     *
//     * @param fileName 로그 파일 이름
//     * @return 로그 목록
//     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
//     */
//    List<LogEntity> readLogs(String fileName) throws IOException;
//
//    /**
//     * 특정 로그 파일에서 최신 로그를 지정된 개수만큼 읽어 반환
//     *
//     * @param fileName 로그 파일 이름
//     * @param limit    조회할 로그 개수 제한
//     * @return 최신 로그 목록
//     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
//     */
//    List<LogEntity> readLastNLogs(String fileName, int limit) throws IOException;
//
//    /**
//     * 특정 시간 범위 내의 로그를 조회
//     *
//     * @param fileName   로그 파일 이름
//     * @param startTime  조회 시작 시간
//     * @param endTime    조회 종료 시간
//     * @return 시간 범위 내의 로그 목록
//     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
//     */
//    List<LogEntity> readLogsByTimeRange(String fileName, LocalDateTime startTime, LocalDateTime endTime) throws IOException;

    /**
     * 업로드된 로그 파일을 저장
     *
     * @param file        업로드할 로그 파일
     * @param newFileName 저장할 새로운 파일 이름
     * @return 저장된 파일의 이름
     * @throws IOException 파일 저장 중 오류 발생 시 예외 발생
     * @throws LogFileNotFoundException 파일 저장 중 오류 발생 시 예외 발생
     */
    String saveLog(MultipartFile file, String newFileName) throws LogFileNotFoundException, IOException;

}
