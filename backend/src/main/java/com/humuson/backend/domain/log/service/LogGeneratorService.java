package com.humuson.backend.domain.log.service;

/**
 * 로그 생성 서비스 인터페이스
 * - 주기적으로 로그를 생성하는 기능을 제공
 */
public interface LogGeneratorService {

    /**
     * 로그를 생성하는 메서드
     * - 주어진 조건에 따라 다양한 로그 유형을 생성
     */
    void generateLog();

}
