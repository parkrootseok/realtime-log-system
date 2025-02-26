package com.humuson.backend.global.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.humuson.backend.application.log.usecase.LogUseCase;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * 실시간 로그 스트리밍을 WebSocket을 통해 제공하는 핸들러
 * - 클라이언트가 연결되면 최근 로그를 제공하고, 주기적으로 새로운 로그를 스트리밍
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LogStreamWebSocketHandler extends TextWebSocketHandler {

    private final LogUseCase logUseCase;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    /**
     * WebSocket 클라이언트가 연결되었을 때 실행
     * - 초기 로그 데이터를 전송하고, 로그 스트리밍을 시작
     *
     * @param session 연결된 WebSocket 세션
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        log.info("Log Stream WebSocket 클라이언트 연결: {}", session.getId());
        sendInitialLogs(session);
        startLogStreaming(session);
    }

    /**
     * WebSocket 클라이언트가 연결 종료되었을 때 실행
     *
     * @param session 연결이 종료된 WebSocket 세션
     * @param status  연결 종료 상태
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        log.info("WebSocket 연결 종료: {}", session.getId());
    }

    /**
     * 초기 로그 데이터를 클라이언트에게 전송
     *
     * @param session 로그 데이터를 보낼 WebSocket 세션
     */
    private void sendInitialLogs(WebSocketSession session) {
        try {
            List<LogEntity> logs = logUseCase.getRecentLogsByLimit("app.log", 20); // 최신 20개만 가져오기
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(logs)));
        } catch (IOException e) {
            log.error("초기 로그 전송 중 오류 발생: {}", e.getMessage());
        }
    }

    /**
     * 실시간 로그 스트리밍을 시작
     * - 9초마다 최신 로그를 가져와 클라이언트에 전송
     *
     * @param session 로그 데이터를 보낼 WebSocket 세션
     */
    private void startLogStreaming(WebSocketSession session) {
        new Thread(() -> {
            try {
                LogEntity lastSentLog = null;
                while (session.isOpen()) {
                    Thread.sleep(Duration.ofSeconds(9).toMillis());
                    List<LogEntity> latestLogList = logUseCase.getRecentLogsByLimit("app.log", 1);
                    if (!latestLogList.isEmpty()) {
                        LogEntity latestLog = latestLogList.get(0);
                        if (!latestLog.equals(lastSentLog)) {
                            try {
                                if (session.isOpen()) {
                                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(latestLog)));
                                    lastSentLog = latestLog;
                                }
                            } catch (IOException e) {
                                break;
                            }
                        }
                    }
                }
            } catch (IOException | InterruptedException e) {
                log.error("WebSocket 로그 스트리밍 중 오류 발생: {}", e.getMessage());
            }
        }).start();
    }

}
