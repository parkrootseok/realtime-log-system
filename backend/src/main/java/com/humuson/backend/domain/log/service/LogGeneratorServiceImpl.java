package com.humuson.backend.domain.log.service;

import java.util.Random;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * 로그 생성 서비스 구현체
 * - 일정 주기로 랜덤 로그를 생성하는 기능을 수행
 */
@Slf4j
@Service
public class LogGeneratorServiceImpl implements LogGeneratorService {

    private static final Random RANDOM = new Random(); // 랜덤 객체 생성
    private static final String[] SERVICES = {"UserService", "PaymentService", "InventoryService"}; // 서비스 이름 목록

    /**
     * 일정 주기로 로그를 생성하는 메서드
     * - `INFO`: 사용자 로그인 성공
     * - `WARN`: 재고 부족 경고
     * - `ERROR`: 결제 실패
     *
     * `@Scheduled(fixedRate = 10000)`을 사용하여 10초마다 실행됨
     */
    @Override
    @Scheduled(fixedRate = 10000)
    public void generateLog() {
        String service = SERVICES[RANDOM.nextInt(SERVICES.length)]; // 랜덤 서비스 선택
        int logType = RANDOM.nextInt(3); // 로그 유형 선택 (0: INFO, 1: WARN, 2: ERROR)

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
