package com.humuson.backend.application.log.usecase;

import com.humuson.backend.domain.log.model.entity.LogEntity;
import reactor.core.publisher.Flux;

public interface StreamingService {

    Flux<LogEntity> streamLogs();

}
