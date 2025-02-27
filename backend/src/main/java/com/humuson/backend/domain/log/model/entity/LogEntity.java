package com.humuson.backend.domain.log.model.entity;

import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "logs")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LogEntity {

    @Id
    private String id;
    private String timestamp;
    private Level level;
    private String className;
    private String serviceName;
    private String message;

    @Builder
    public LogEntity(Map<String, String> parsedLog) {
        this.timestamp = parsedLog.get("timestamp");
        this.level = Level.fromString(parsedLog.get("level"));
        this.className = parsedLog.get("className");
        this.serviceName = parsedLog.get("serviceName");
        this.message = parsedLog.get("message");
    }

    public boolean isInfo() {
        return this.level == Level.INFO;
    }

    public boolean isWarn() {
        return this.level == Level.WARN;
    }

    public boolean isError() {
        return this.level == Level.ERROR;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s - %s - %s - %s", timestamp, level, className, serviceName, message);
    }

}
