package com.humuson.backend.domain.log.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.stream.Stream;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/logs")
public class LogController {

    private static final Path LOG_FILE_PATH = Path.of("logs/app.log");

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamLogs() {
        return Flux.interval(Duration.ofSeconds(1))
                .flatMap(tick -> Flux.fromStream(readLastLines(20)))
                .map(line -> line + "\n");
    }

    private Stream<String> readLastLines(int lines) {
        try (Stream<String> stream = Files.lines(LOG_FILE_PATH)) {
            long totalLines = Files.lines(LOG_FILE_PATH).count();
            return stream.skip(Math.max(0, totalLines - lines)).toList().stream();
        } catch (Exception e) {
            return Stream.of("No logs available...").toList().stream();
        }
    }

}
