package com.humuson.backend.global.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.humuson.backend.application.log.usecase.LogUseCase;
import com.humuson.backend.domain.log.model.dto.response.LogDistributionResponseDto;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import com.humuson.backend.domain.log.service.LogService;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class LogStreamWebSocketHandler extends TextWebSocketHandler {

    private final LogUseCase logUseCase;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(
            new JavaTimeModule());
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        log.info("Log Stream WebSocket 클라이언트 연결: {}", session.getId());
        sendInitialLogs(session);
        startLogStreaming(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {

        sessions.remove(session);
        log.info("WebSocket 연결 종료: {}", session.getId());

    }

    private void sendInitialLogs(WebSocketSession session) {
        try {
            List<LogEntity> logs = logUseCase.getLastNLogs("app.log", 20); // 최신 20개만 가져오기
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(logs)));
        } catch (IOException e) {
            log.error("초기 로그 전송 중 오류 발생: {}", e.getMessage());
        }
    }

    private void startLogStreaming(WebSocketSession session) {
        new Thread(() -> {
            try {
                LogEntity lastSentLog = null;
                while (session.isOpen()) {
                    Thread.sleep(Duration.ofSeconds(9).toMillis());
                    List<LogEntity> latestLogList = logUseCase.getLastNLogs("app.log", 1);
                    if (!latestLogList.isEmpty()) {
                        LogEntity latestLog = latestLogList.get(0);
                        if (!latestLog.equals(lastSentLog)) {
                            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(latestLog)));
                            lastSentLog = latestLog;
                        }
                    }
                }
            } catch (IOException | InterruptedException e) {
                log.error("WebSocket 로그 스트리밍 중 오류 발생: {}", e.getMessage());
            }
        }).start();
    }

}
