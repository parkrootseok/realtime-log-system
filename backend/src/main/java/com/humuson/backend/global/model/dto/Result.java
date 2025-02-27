package com.humuson.backend.global.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Result<T> {

    private LocalDateTime timestamp = LocalDateTime.now();
    private UUID trackingId = UUID.randomUUID();
    private T data;

    private Result(T data) {
        this.data = data;
    }

    public static <T> Result<T> of(T data) {
        return new Result<>(data);
    }

    public static <T> Result<T> empty() {
        return new Result<>(null);
    }

}