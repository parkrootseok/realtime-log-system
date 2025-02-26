package com.humuson.backend.infrastructure.log.repository;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface LogRepository {

    List<LogEntity> readLogs(String fileName) throws IOException;
    List<LogEntity> readLastNLogs(String fileName, int limit) throws IOException;
    String saveLog(MultipartFile file) throws IOException;

}
