package com.humuson.backend.domain.log.service;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface LogAnalysisService {

    Map<Level, Long> getLogsCountByLevel(List<LogEntity> logs, String levels) throws IOException;
    List<LogEntity> getLogsFilterByLevel(List<LogEntity> logs, String levels) throws IOException;
    Map<String, Map<Level, Long>> getLogsGroupByMinute(List<LogEntity> logs) throws IOException;

}
