package com.humuson.backend.infrastructure.log.repository;

import com.humuson.backend.domain.log.model.entity.Level;
import com.humuson.backend.domain.log.model.entity.LogEntity;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MongoLogRepository extends MongoRepository<LogEntity, String> {

    List<LogEntity> findAllByLevelIn(List<Level> levels);

    Page<LogEntity> findAllByLevelIn(List<Level> levels, Pageable pageable);

    List<LogEntity> findAllByOrderByTimestampDesc(Pageable pageable);

    List<LogEntity> findAllByTimestampBetween(String start, String end);

}
