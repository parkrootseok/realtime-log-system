package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface LogQueryService {

    List<LogEntity> getLogs(String fileName) throws IOException;
    List<LogEntity> getRecentLogsByLimit(String fileName, int limit) throws IOException;
    List<LogEntity> getLogsByStartAndEnd(String fileName, LocalDateTime start, LocalDateTime end) throws IOException;

}
