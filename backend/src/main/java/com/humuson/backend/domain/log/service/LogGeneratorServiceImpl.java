package com.humuson.backend.domain.log.service;

import static com.humuson.backend.global.constant.Format.TIMESTAMP_FORMAT;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.infrastructure.log.repository.LogRepository;
import com.humuson.backend.infrastructure.log.repository.MongoLogRepository;
import java.time.LocalDateTime;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogGeneratorServiceImpl {

    private static final Random RANDOM = new Random();
    private static final String[] SERVICES = {"UserService", "PaymentService", "InventoryService"};

    private final MongoLogRepository logRepository;

    @Scheduled(fixedRate = 10000)
    public void generateLog() {

        String serviceName = SERVICES[RANDOM.nextInt(SERVICES.length)];
        int logType = RANDOM.nextInt(3);

        String level;
        String msg;
        switch (logType) {
            case 0 -> {
                level = "INFO";
                msg = "User login successful: user" + RANDOM.nextInt(1000);
            }
            case 1 -> {
                level = "WARN";
                msg = "Low stock warning for item: A" + RANDOM.nextInt(9999);
            }
            default -> {
                level = "ERROR";
                msg = "Payment failed for order: " + RANDOM.nextInt(100000);
            }
        }

        logRepository.save(LogEntity.builder()
                .timestamp(LocalDateTime.now().format(TIMESTAMP_FORMAT))
                .level(Level.fromString(level))
                .serviceName(serviceName)
                .message(msg)
                .build());

        switch (level) {
            case "INFO" -> log.info("[{}] - {}", serviceName, msg);
            case "WARN" -> log.warn("[{}] - {}", serviceName, msg);
            case "ERROR" -> log.error("[{}] - {}", serviceName, msg);
        }

    }

}
