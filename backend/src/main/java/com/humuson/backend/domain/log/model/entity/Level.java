package com.humuson.backend.domain.log.model.entity;

public enum Level {

    ERROR, WARN, INFO, UNKNOWN;

    public static Level fromString(String levelString) {

        for (Level level : values()) {
            if (level.name().equalsIgnoreCase(levelString)) {
                return level;
            }
        }

        return UNKNOWN;

    }

}
