package com.humuson.backend.adapter.controller;

import com.humuson.backend.application.log.usecase.LogUseCase;
import com.humuson.backend.domain.log.model.dto.response.GetCountLogResponse;
import com.humuson.backend.domain.log.model.dto.response.GetFilteredLogResponse;
import com.humuson.backend.domain.log.model.dto.response.UploadLogResponse;
import com.humuson.backend.global.model.dto.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

/**
 * 로그 관련 기능을 제공하는 컨트롤러
 * - 로그 레벨 분석
 * - 특정 레벨의 로그 필터링
 * - 로그 파일 업로드
 */
@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogUseCase logUseCase;

    /**
     * 특정 로그 파일에서 로그 레벨별 개수를 분석하여 반환
     *
     * @param fileName 분석할 로그 파일 이름 (기본값: "app.log")
     * @param levels   분석할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @return 로그 레벨별 개수를 담은 응답 객체
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @GetMapping("/analyze")
    public Result<GetCountLogResponse> getAnalyzeLogByLevel(
            @RequestParam(defaultValue = "app.log") String fileName,
            @RequestParam(required = false) String levels
    ) throws IOException {
        return Result.of(logUseCase.analyzeLogLevels(fileName, levels));
    }

    /**
     * 특정 로그 파일에서 지정한 로그 레벨에 해당하는 로그를 페이징하여 조회
     *
     * @param fileName 분석할 로그 파일 이름 (기본값: "app.log")
     * @param levels   조회할 로그 레벨 (예: "ERROR,WARN,INFO")
     * @param page     페이지 번호 (기본값: 0)
     * @param size     페이지 크기 (기본값: 20)
     * @return 필터링된 로그 목록을 포함한 응답 객체
     * @throws IOException 파일 처리 중 오류 발생 시 예외 발생
     */
    @GetMapping("/errors")
    public Result<GetFilteredLogResponse> getFilteredLogs(
            @RequestParam(defaultValue = "app.log") String fileName,
            @RequestParam(required = false) String levels,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) throws IOException {
        return Result.of(logUseCase.filterLogsByLevel(fileName, levels, page, size));
    }

    /**
     * 로그 파일을 업로드하여 저장
     *
     * @param file 업로드할 로그 파일 (Multipart 요청)
     * @return 업로드된 로그 파일 정보 응답 객체
     */
    @PostMapping("/upload")
    public Result<UploadLogResponse> uploadLog(@RequestParam("file") MultipartFile file) {
        return Result.of(logUseCase.saveLogFile(file));
    }
}
