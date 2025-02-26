package com.humuson.backend.global.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.humuson.backend.application.log.usecase.LogUseCase;
import com.humuson.backend.domain.log.model.dto.response.GetLogDistributionResponse;
import java.io.IOException;
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

/**
 * 로그 분포를 WebSocket을 통해 전송하는 핸들러
 * - 클라이언트가 특정 요청을 보내면 최근 10분간의 로그 분포 데이터를 반환
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LogDistributionWebSocketHandler extends TextWebSocketHandler {

    private final LogUseCase logUseCase;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    /**
     * WebSocket 클라이언트가 연결되었을 때 실행
     *
     * @param session 연결된 WebSocket 세션
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        log.info("Log Distribution : WebSocket 클라이언트 연결: {}", session.getId());
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
        log.info("Log Distribution : WebSocket 연결 종료: {}", session.getId());
    }

    /**
     * 클라이언트가 메시지를 보냈을 때 실행
     *
     * @param session 메시지를 보낸 WebSocket 세션
     * @param message 수신된 텍스트 메시지
     * @throws Exception 예외 발생 시
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        if (payload.contains("logDistribution")) {
            sendLogDistribution(session, "app.log");
        }
    }

    /**
     * 클라이언트에게 로그 분포 데이터를 전송
     *
     * @param session 로그 데이터를 보낼 WebSocket 세션
     * @param fileName 로그 파일 이름
     * @throws IOException 데이터 전송 중 오류 발생 시
     */
    private void sendLogDistribution(WebSocketSession session, String fileName) throws IOException {
        LocalDateTime now = LocalDateTime.now();
        GetLogDistributionResponse logDistribution = logUseCase.getLogDistribution(fileName, now.minusMinutes(10), now);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(logDistribution)));
    }

}
