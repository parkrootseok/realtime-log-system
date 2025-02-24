package com.humuson.backend.global.config;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.FileAppender;
import ch.qos.logback.core.util.FileSize;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LogbackConfig {

    private static final String LOG_FILE_PATH = "logs/app.log";
    private static final String LOG_PATTERN = "%d{yyyy-MM-dd HH:mm:ss} %-5level [%logger{1}] - %msg%n";
    private static final String TARGET_PACKAGE = "com.humuson.backend.domain.log.service";

    @Bean
    public LoggerContext loggerContext() {
        return (LoggerContext) LoggerFactory.getILoggerFactory();
    }

    @Bean
    public PatternLayoutEncoder logEncoder(LoggerContext context) {
        PatternLayoutEncoder encoder = new PatternLayoutEncoder();
        encoder.setContext(context);
        encoder.setPattern(LOG_PATTERN);
        encoder.start();
        return encoder;
    }

    @Bean
    public FileAppender fileAppender(LoggerContext context, PatternLayoutEncoder encoder) {
        FileAppender fileAppender = new FileAppender();

        fileAppender.setContext(context);
        fileAppender.setFile(LOG_FILE_PATH);
        fileAppender.setAppend(true);
        fileAppender.setEncoder(encoder);
        fileAppender.setBufferSize(FileSize.valueOf("1"));   // 로그 발생 후 즉시 반영될 수 있도록 설정 추가
        fileAppender.start();
        return fileAppender;
    }

    @Bean
    public Logger logGeneratorServiceLogger(LoggerContext context, FileAppender fileAppender) {
        Logger logger = context.getLogger(TARGET_PACKAGE);
        logger.setLevel(Level.INFO);
        logger.addAppender(fileAppender);
        return logger;
    }

}