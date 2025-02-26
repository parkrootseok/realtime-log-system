package com.humuson.backend.domain.log.model.dto.response;

import com.humuson.backend.domain.log.model.entity.Level;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import lombok.AccessLevel;
import lombok.Builder;

@Builder(access = AccessLevel.PRIVATE)
public record LogDistributionResponseDto(String timestamp, Map<Level, Long> counts) {

    public static LogDistributionResponseDto of(String timestamp, Map<Level, Long> counts) {
        return LogDistributionResponseDto.builder()
                .timestamp(timestamp)
                .counts(counts)
                .build();
    }

    public static List<LogDistributionResponseDto> of(Set<Entry<String, Map<Level, Long>>> entrySet) {
        return entrySet.stream()
                .map(entry -> of(entry.getKey(), entry.getValue()))
                .toList();
    }

}
