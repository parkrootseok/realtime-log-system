package com.humuson.backend.global.config;

import com.humuson.backend.global.handler.LogDistributionWebSocketHandler;
import com.humuson.backend.global.handler.LogStreamWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final LogStreamWebSocketHandler logStreamHandler;
    private final LogDistributionWebSocketHandler logDistributionHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(logStreamHandler, "/log/ws-stream").setAllowedOrigins("*");
        registry.addHandler(logDistributionHandler, "/log/ws-distribution").setAllowedOrigins("*");
    }

}
