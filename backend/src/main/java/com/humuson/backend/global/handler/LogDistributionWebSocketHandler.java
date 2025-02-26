package com.humuson.backend.global.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
public class LogDistributionWebSocketHandler extends TextWebSocketHandler {

    private final LogService logService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        log.info("Log Distribution WebSocket 클라이언트 연결: {}", session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {

        sessions.remove(session);
        log.info("WebSocket 연결 종료: {}", session.getId());

    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        if (payload.contains("logDistribution")) {
            sendLogDistribution(session, "app.log");
        }
    }

    private void sendLogDistribution(WebSocketSession session, String fileName) throws IOException {
        LocalDateTime now = LocalDateTime.now();
        List<LogEntity> logs = logService.readLogsByTimeRange(fileName, now.minusMinutes(10), now);
        List<LogDistributionResponseDto> logGroupedByTime = logService.groupLogsByMinute(logs);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(logGroupedByTime)));
    }

}
