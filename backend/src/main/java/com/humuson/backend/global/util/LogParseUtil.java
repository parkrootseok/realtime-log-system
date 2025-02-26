package com.humuson.backend.global.util;

import static com.humuson.backend.global.constant.Format.TIMESTAMP_FORMAT;

import com.humuson.backend.global.exception.LogParsingException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LogParseUtil {

    private static final Pattern LOG_PATTERN = Pattern.compile(
            "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2})\\s+(\\w+)\\s+\\[([^\\]]+)\\]\\s+-\\s+\\[([^\\]]+)\\]\\s+-\\s+(.+)$"
    );

    public static Map<String, String> parseLog(String stringLog) {

        try {

            Matcher matcher = LOG_PATTERN.matcher(stringLog);

            if (!matcher.matches()) {
                throw new LogParsingException();
            }

            return getParsedLog(matcher);

        } catch (Exception e) {
            log.warn("로그 파싱 실패 (무시됨): {}", stringLog);
            return null;
        }

    }

    private static Map<String, String> getParsedLog(Matcher matcher) {
        Map<String, String> parsedLog = new HashMap<>();
        parsedLog.put("timestamp", formatTimestamp(matcher.group(1)));
        parsedLog.put("level", matcher.group(2));
        parsedLog.put("className", matcher.group(3));
        parsedLog.put("serviceName", matcher.group(4));
        parsedLog.put("message", matcher.group(5));
        return parsedLog;
    }

    private static String formatTimestamp(String timestampStr) {
        LocalDateTime timestamp = LocalDateTime.parse(timestampStr, TIMESTAMP_FORMAT);
        return timestamp.format(TIMESTAMP_FORMAT);
    }

}
