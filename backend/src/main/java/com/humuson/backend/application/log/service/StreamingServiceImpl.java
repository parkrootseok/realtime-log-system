package com.humuson.backend.application.log.service;

import com.humuson.backend.application.log.usecase.StreamingService;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.domain.log.service.LogService;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class StreamingServiceImpl implements StreamingService {

    private final LogService logService;

    @Override
    public Flux<LogEntity> streamLogs() {
        return Flux.interval(Duration.ofSeconds(9))
                .flatMap(tick -> Flux.fromStream(readLastLogs(20)));
    }

    private Stream<LogEntity> readLastLogs(int line) {
        try {
            List<LogEntity> logs = logService.readLogs(null);
            int totalLogs = logs.size();
            return logs.stream()
                    .skip(Math.max(0, totalLogs - line))
                    .sorted((log1, log2) -> log2.getTimestamp().compareTo(log1.getTimestamp()));
        } catch (IOException e) {
            log.error("로그 파일을 읽는 중 오류 발생: {}", e.getMessage());
            return Stream.of(new LogEntity("Parsing Error: No logs available..."));
        }
    }

}
