# 제품팀 과제테스트

## 📑 목차

- [제품팀 과제테스트](#제품팀-과제테스트)
  - [📑 목차](#-목차)
  - [📋 프로젝트 개요](#-프로젝트-개요)
  - [✅ 주요 기능 및 요구사항 충족 여부](#-주요-기능-및-요구사항-충족-여부)
    - [1. 로그 데이터 생성](#1-로그-데이터-생성)
    - [2. 로그 분석 API](#2-로그-분석-api)
      - [2-1. 로그 파일 업로드 (POST /logs/upload)](#2-1-로그-파일-업로드-post-logsupload)
      - [2-2. 로그 분석 (GET /logs/analyze)](#2-2-로그-분석-get-logsanalyze)
      - [2-3. 에러 로그 조회 (GET /logs/errors)](#2-3-에러-로그-조회-get-logserrors)
      - [2-4. 실시간 로그 스트리밍 (GET /logs/stream)](#2-4-실시간-로그-스트리밍-get-logsstream)
    - [3. 웹 UI](#3-웹-ui)
  - [🛠 기술 스택](#-기술-스택)
    - [클라이언트](#클라이언트)
    - [서버](#서버)
    - [공통](#공통)
  - [1. 루트 디렉터리 이동](#1-루트-디렉터리-이동)
  - [2. frontend 폴더로 이동 후 .env 파일 생성](#2-frontend-폴더로-이동-후-env-파일-생성)
  - [3. Docker Compose 실행](#3-docker-compose-실행)
  - [📌 API 문서](#-api-문서)
    - [**1. POST /logs/upload**](#1-post-logsupload)
    - [**2. GET /logs/analyze**](#2-get-logsanalyze)
    - [**3. GET /logs/errors**](#3-get-logserrors)
    - [**4. GET /logs/ws-stream**](#4-get-logsws-stream)
    - [**5. GET /logs/ws-distribution**](#5-get-logsws-distribution)
  - [💻 웹 UI 설명](#-웹-ui-설명)
    - [실시간 로그 기반 (app.log 파일 사용)](#실시간-로그-기반-applog-파일-사용)
    - [업로드 로그 기반 (사용자가 업로드한 로그 파일 사용)](#업로드-로그-기반-사용자가-업로드한-로그-파일-사용)
  - [AI 도구를 활용한 로그 모니터링 서비스 개발 상세 가이드](#ai-도구를-활용한-로그-모니터링-서비스-개발-상세-가이드)
    - [클라이언트 개발](#클라이언트-개발)
      - [1. 최신 기술 스택 기반 초기 설정](#1-최신-기술-스택-기반-초기-설정)
      - [2. 아키텍처 및 프로젝트 구조 설계](#2-아키텍처-및-프로젝트-구조-설계)
      - [3. 로그 모니터링 특화 UI/UX 구현](#3-로그-모니터링-특화-uiux-구현)
      - [4. Zustand로의 상태 관리 마이그레이션](#4-zustand로의-상태-관리-마이그레이션)
    - [서버 개발 및 개선](#서버-개발-및-개선)
      - [1. 코드 리팩토링 및 아키텍처 개선](#1-코드-리팩토링-및-아키텍처-개선)
    - [공통: 협업 및 문서화 최적화](#공통-협업-및-문서화-최적화)
      - [1. 체계적인 문서화 및 지식 관리](#1-체계적인-문서화-및-지식-관리)

## 📋 프로젝트 개요

Spring Boot 기반 로그 분석 시스템과 React 대시보드를 구현하여, 로그 데이터 생성, 분석, 시각화를 수행하는 과제 테스트입니다.

## ✅ 주요 기능 및 요구사항 충족 여부

### 1. 로그 데이터 생성

-   **기능 설명**: Logback을 이용하여 10초 간격으로 로그를 자동 생성
-   **요구사항 체크리스트**:
    -   [x] 10초 간격 자동 로그 생성 구현
    -   [x] 랜덤하게 INFO, ERROR, WARN 로그 출력 구현

### 2. 로그 분석 API

#### 2-1. 로그 파일 업로드 (POST /logs/upload)

-   **기능 설명**: 사용자가 로그 파일을 업로드할 수 있음
-   **요구사항 체크리스트**:
    -   [x] 파일 업로드 기능 구현
    -   [x] 업로드 후 로그 데이터 반영 처리

#### 2-2. 로그 분석 (GET /logs/analyze)

-   **기능 설명**: 전체 로그 개수와 ERROR 로그 개수를 분석하여 반환
-   **요구사항 체크리스트**:
    -   [x] 전체 로그 개수 반환 구현
    -   [x] ERROR 로그 개수 반환 구현

#### 2-3. 에러 로그 조회 (GET /logs/errors)

-   **기능 설명**: ERROR 및 WARN 로그만 필터링하여 조회
-   **요구사항 체크리스트**:
    -   [x] ERROR, WARN 로그 필터링 구현

#### 2-4. 실시간 로그 스트리밍 (GET /logs/stream)

-   **기능 설명**: WebSocket을 활용하여 실시간 로그 스트리밍 제공
-   **요구사항 체크리스트**:
    -   [x] WebSocket 기반 실시간 데이터 전송 구현

### 3. 웹 UI

-   **기능 설명**: 단일 페이지에서 로그 분석 결과를 시각화
-   **요구사항 체크리스트**:
    -   [x] 최신 로그 20개 테이블 표시 구현
    -   [x] 에러 로그 개수 차트 (예: Bar Chart) 구현
    -   [x] 로그 검색 및 필터링 기능 구현

## 🛠 기술 스택

### 클라이언트

|                  |                                                                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| Framework        | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">                                  |
| Language         | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>                       |
| Styling          | <img src="https://img.shields.io/badge/styled%20components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">         |
| State Management | <img src="https://img.shields.io/badge/zustanrd-5B4638?style=for-the-badge&logoColor=white">                                          |
| IDE              | <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visualstudiocode&logoColor=white"/> |

### 서버

|           |                                                                                                                          |
| :-------- | :----------------------------------------------------------------------------------------------------------------------- |
| Framework | <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white"/>          |
| Language  | <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white"/>                   |
| IDE       | <img src="https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white"/> |

### 공통

|                 |                                                                                                                                                                                                                         |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version Control | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>               |
| Copilot         | <img src="https://img.shields.io/badge/openai-412991.svg?style=for-the-badge&logo=openai&logoColor=white"/> <img src="https://img.shields.io/badge/Cursor-181717.svg?style=for-the-badge&logo=Cursor&logoColor=white"/> |

## 1. 루트 디렉터리 이동

```bash
cd humuson-assignment
```

## 2. frontend 폴더로 이동 후 .env 파일 생성

```bash
cd frontend
```

```bash
echo "REACT_APP_API_URL=http://localhost:8080" >> .env
echo "REACT_APP_WS_URL=ws://localhost:8080" >> .env
```

```bash
cd ..
```

## 3. Docker Compose 실행

```bash
docker compose up -d --build
```

## 📌 API 문서

### **1. POST /logs/upload**

-   **설명**: 로그 파일을 업로드하는 기능
-   **요청 형식**: `multipart/form-data`
-   **요청 데이터**:  
     | 필드 | 타입 | 필수 여부 | 설명 |
    |---------|-----------------------|-----------|----------------------------------------|
    | `file` | `multipart/form-data` | ✅ | 업로드할 로그 파일 (`.log`, `.txt` 지원) |
-   **응답 예시 (`200 OK`)**:
    ```json
    {
        "fileName": "d8b7e3a4-45fa-4dfb-b2a2-8f42b6899f64.log"
    }
    ```

---

### **2. GET /logs/analyze**

-   **설명**: 전체 로그 개수 및 `ERROR` 로그 개수를 분석
-   **요청 파라미터**:  
     | 필드 | 타입 | 필수 여부 | 기본값 | 설명 |
    |-----------|---------|-----------|-----------------|--------------------------------|
    | `fileName`| `string`| ❌ | `logs/app.log` | 분석할 로그 파일명 (생략 시 기본 로그 파일 사용) |
-   **응답 예시** (`200 OK`):
    ```json
    {
        "totalLogs": "1300",
        "errorLogs": "345"
    }
    ```

---

### **3. GET /logs/errors**

-   **설명**: 특정 레벨(`ERROR`, `WARN`, `INFO`)의 로그 목록을 조회
-   **요청 파라미터**:  
     | 필드 | 타입 | 필수 여부 | 기본값 | 설명 |
    |-----------|---------|-----------|---------------------|----------------------------------|
    | `fileName`| `string`| ❌ | `logs/app.log` | 조회할 로그 파일명 |
    | `levels` | `string`| ❌ | `"ERROR,WARN,INFO"` | 조회할 로그 레벨 (쉼표로 구분) |
-   **응답 예시** (`200 OK`):
    ```json
    [
        {
            "timestamp": "2025-02-25 15:37:36",
            "level": "WARN",
            "className": "c.h.b.d.l.s.LogGeneratorServiceImpl",
            "serviceName": "PaymentService",
            "message": "Low stock warning for item: A8841"
        }
    ]
    ```

---

### **4. GET /logs/ws-stream**

-   **설명**:

    -   WebSocket 기반 실시간 로그 스트리밍 API
    -   클라이언트는 WebSocket을 통해 **최초 연결 시 최근 20개 로그를 수신**하고, 이후 **9초 주기로 최신 로그를 자동 수신**

-   **요청 형식**:

    -   `ws://` 또는 `wss://`(SSL 환경)
    -   클라이언트는 WebSocket 연결을 통해 로그 데이터를 지속적으로 수신

-   **응답 예시 (WebSocket 메시지 포맷)**:

    ```json
    {
        "timestamp": "2025-02-25 15:37:36",
        "level": "WARN",
        "className": "c.h.b.d.l.s.LogGeneratorServiceImpl",
        "serviceName": "PaymentService",
        "message": "Low stock warning for item: A8841"
    }
    ```

-   **참고 사항**:
    -   WebSocket 연결 URL은 환경 변수(`REACT_APP_WS_URL`)에서 관리

### **5. GET /logs/ws-distribution**

-   **설명**:

    -   WebSocket 기반 **로그 분포 데이터 조회 API**
    -   클라이언트는 WebSocket을 통해 **최근 10분간의 로그 데이터를 수신**하고, **로그 레벨별(Info, Warn, Error) 분포를 1분 단위로 그룹화하여 제공**

-   **요청 형식**:

    -   `ws://` 또는 `wss://`(SSL 환경)
    -   클라이언트는 WebSocket 연결을 통해 일정 시간 내 로그 분포 데이터를 수신

-   **응답 예시 (WebSocket 메시지 포맷)**:

    ```json
    [
        {
            "timestamp": "2025-02-25 15:30",
            "counts": {
                "INFO": 5,
                "WARN": 3,
                "ERROR": 1
            }
        },
        {
            "timestamp": "2025-02-25 15:31",
            "counts": {
                "INFO": 2,
                "WARN": 6,
                "ERROR": 0
            }
        }
    ]
    ```

-   **참고 사항**:
    -   `timestamp`는 **초(`ss`)를 제외한 `yyyy-MM-dd HH:mm` 형식**으로 제공됨
    -   로그 분포 데이터는 **최대 10분 범위 내에서 조회되며, 1분 단위로 그룹화됨**
    -   WebSocket 연결 URL은 환경 변수(`REACT_APP_WS_URL`)에서 관리

## 💻 웹 UI 설명

### 실시간 로그 기반 (app.log 파일 사용)

|                                                 로그 분석                                                  |                                 실시간 로그 조회                                  |                                   로그 필터링                                    |
| :--------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|                     <img width="80%" src="./screenshots/실시간로그분석_로그분석.png">                      |      <img width="84%" src="./screenshots/실시간로그분석_실시간로그조회.png">      |       <img width="80%" src="./screenshots/실시간로그분석_로그필터링.png">        |
| **app.log 파일을 기준으로 레벨(INFO, ERROR, WARN)에 대한 통계 및 비율과 실시간 로그 발생량을 보여줍니다.** | **가장 최근에 발생한 20개의 로그를 조회할 수 있으며, 실시간으로 업데이트됩니다.** | **특정 조건(INFO, ERROR, WARN 등)에 맞는 로그를 필터링하여 조회할 수 있습니다.** |

### 업로드 로그 기반 (사용자가 업로드한 로그 파일 사용)

|                                  업로드 전                                  |                                           로그 분석 조회                                            |                                       전체 로그 조회                                        |
| :-------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
|      <img width="84%" src="./screenshots/업로드로그분석_업로드전.png">      |                  <img width="80%" src="./screenshots/업로드로그분석_로그분석.png">                  |            <img width="84%" src="./screenshots/업로드로그분석_전체로그조회.png">            |
| **로그 파일을 업로드하기 전의 화면으로, 분석할 파일을 선택할 수 있습니다.** | **업로드한 로그 파일을 기준으로 레벨(INFO, ERROR, WARN)에 대한 통계 및 비율을 확인할 수 있습니다.** | **업로드한 로그의 전체 내용을 조회할 수 있으며, 시간순으로 정렬된 로그 목록을 제공합니다.** |

## AI 도구를 활용한 로그 모니터링 서비스 개발 상세 가이드

### 클라이언트 개발

> 프론트엔드 개발 역량을 강화하기 위해 Cursor AI를 전략적으로 활용하여 React 19 기반의 모던 애플리케이션을 효율적으로 구축했습니다.

#### 1. 최신 기술 스택 기반 초기 설정

-   **React 19 프로젝트 생성**

    -   최신 React 19.0.0 기반 애플리케이션 구조 설계

-   **최적화된 패키지 구성**

    -   **UI 프레임워크**: MUI v6 (@mui/material, @mui/icons-material v6.4.5)
    -   **스타일링**: Emotion (@emotion/react, @emotion/styled) 및 styled-components v6
    -   **상태 관리**: Zustand v5.0.3 적용으로 간결하고 유연한 상태 관리 구현
    -   **데이터 시각화**: Recharts v2.15.1, Chart.js v4.4.8, react-chartjs-2 v5.3.0을 활용한 다양한 시각화 옵션
    -   **날짜 처리**: date-fns v4.1.0을 활용한 효율적인 시간 데이터 처리
    -   **API 통신**: axios v1.7.9를 활용한 백엔드 통신 계층 구현
    -   **아이콘**: react-icons v5.5.0으로 풍부한 아이콘 세트 활용

-   **개발 환경 최적화**
    -   ESLint v8.57.1 + Prettier v3.5.2 조합으로 코드 품질 및 일관성 보장
    -   React 전용 린트 플러그인(eslint-plugin-react v7.37.4, eslint-plugin-react-hooks v5.1.0) 적용
    -   npm 스크립트 최적화 (format, lint)로 개발 워크플로우 자동화

#### 2. 아키텍처 및 프로젝트 구조 설계

-   **모듈화된 컴포넌트 아키텍처**
-   **Zustand 기반 상태 관리 아키텍처**

#### 3. 로그 모니터링 특화 UI/UX 구현

-   **직관적인 대시보드 설계**

    -   MUI v6의 Grid 시스템을 활용한 반응형 대시보드 레이아웃

-   **고급 데이터 시각화**
    -   Recharts와 Chart.js를 활용한 다양한 차트 유형 구현
        -   시계열 로그 데이터를 위한 라인 차트
        -   오류 분포 시각화를 위한 파이 차트
        -   실시간 모니터링을 위한 애니메이션 차트

#### 4. Zustand로의 상태 관리 마이그레이션

-   **단계적 마이그레이션 전략**
    -   기존 React 상태 관리(useState, useContext)에서 Zustand로 점진적 전환

### 서버 개발 및 개선

> 백엔드 개발에서는 ChatGPT를 활용하여 초기 구현 이후의 코드 품질과 성능을 체계적으로 개선했습니다.

#### 1. 코드 리팩토링 및 아키텍처 개선

-   **점진적 아키텍처 고도화**

    -   초기 모놀리식 Controller 중심 구현에서 계층형 아키텍처로 전환
    -   ChatGPT를 활용한 클린 아키텍처 및 SOLID 원칙 적용
    -   도메인 주도 설계(DDD) 패턴 부분적 도입으로 비즈니스 로직 명확화

-   **코드 품질 향상**
    -   복잡한 메소드의 분할 및 단일 책임 원칙

### 공통: 협업 및 문서화 최적화

> AI 도구를 활용하여 팀 협업과 지식 공유 프로세스를 효율화했습니다.

#### 1. 체계적인 문서화 및 지식 관리

-   **프로젝트 문서화 표준 정립**

    -   README.md 포맷 및 가이드라인 수립
    -   아키텍처 및 기술 스택 문서화

-   **작업 관리 효율화**
    -   AI 기반 커밋 메시지 및 PR 설명 작성 보조

이러한 체계적인 AI 도구 활용을 통해 개발 생산성을 크게 향상시키고, 코드 품질과 문서화 수준을 높이며, 팀의 협업 효율성을 극대화할 수 있었습니다.
