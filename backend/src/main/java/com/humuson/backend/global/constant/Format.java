package com.humuson.backend.global.constant;

import java.time.format.DateTimeFormatter;

public class Format {

    public static final String VALIDATED_ERROR_RESULT_FORMAT = "{message: '%s'}, {input: '%s'}";
    public static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

}

