package com.humuson.backend.domain.log.service;

import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogGeneratorService {

    private static final Random RANDOM = new Random();
    private static final String[] SERVICES = {"UserService", "PaymentService", "InventoryService"};

    @Scheduled(fixedRate = 10000) // 10초마다 실행
    public void generateLog() {

        String service = SERVICES[RANDOM.nextInt(SERVICES.length)];
        int logType = RANDOM.nextInt(3);

        switch (logType) {
            case 0:
                log.info("[{}] - User login successful: user{}", service, RANDOM.nextInt(1000));
                break;
            case 1:
                log.warn("[{}] - Low stock warning for item: A{}", service, RANDOM.nextInt(9999));
                break;
            case 2:
                log.error("[{}] - Payment failed for order: {}", service, RANDOM.nextInt(100000));
                break;
        }

    }

}
