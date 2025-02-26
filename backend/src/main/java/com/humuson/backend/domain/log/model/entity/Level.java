package com.humuson.backend.domain.log.model.entity;

import java.util.Arrays;
import java.util.List;

public enum Level {

    ERROR, WARN, INFO, UNKNOWN;

    public static Level fromString(String levels) {
        return Arrays.stream(values())
                .filter(level -> level.name().equalsIgnoreCase(levels))
                .findFirst()
                .orElse(UNKNOWN);
    }

    public static List<Level> parseLevels(String levels) {
        return (levels != null && !levels.isEmpty())
                ? Arrays.stream(levels.split(",")).map(Level::fromString).toList() : List.of(Level.ERROR, Level.WARN, Level.INFO);
    }

}
