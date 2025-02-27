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
    private String serviceName;
    private String message;

    @Builder
    public LogEntity(String timestamp, Level level, String serviceName, String message) {
        this.timestamp = timestamp;
        this.level = level;
        this.serviceName = serviceName;
        this.message = message;
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

}
