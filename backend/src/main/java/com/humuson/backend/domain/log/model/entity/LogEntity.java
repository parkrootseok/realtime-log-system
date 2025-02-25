package com.humuson.backend.domain.log.model.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LogEntity {

    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final Pattern LOG_PATTERN = Pattern.compile(
            "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2})\\s+(\\w+)\\s+\\[([^\\]]+)\\]\\s+-\\s+\\[([^\\]]+)\\]\\s+-\\s+(.+)$"
    );

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    private Level level;
    private String className;
    private String serviceName;
    private String message;

    @Builder
    public LogEntity(String log) {
        parseLog(log);
    }

    private void parseLog(String log) {

        Matcher matcher = LOG_PATTERN.matcher(log);

        if (matcher.matches()) {
            this.timestamp = LocalDateTime.parse(matcher.group(1), TIMESTAMP_FORMATTER);
            this.level = Level.fromString(matcher.group(2));
            this.className = matcher.group(3);
            this.serviceName = matcher.group(4);
            this.message = matcher.group(5);
        } else {
            this.timestamp = LocalDateTime.now();
            this.level = Level.UNKNOWN;
            this.className = "UNKNOWN";
            this.serviceName = "UNKNOWN";
            this.message = "Parsing Error: " + log;
        }

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
