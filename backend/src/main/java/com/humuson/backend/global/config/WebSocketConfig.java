package com.humuson.backend.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketHandler webSocketHandler;

    @Override
    public void registerWebSocketHandlers(org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/log/ws-stream").setAllowedOrigins("*");
    }

}
