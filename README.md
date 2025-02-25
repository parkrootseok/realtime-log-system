# 제품팀 과제테스트

## 목차

- [제품팀 과제테스트](#제품팀-과제테스트)
  - [목차](#목차)
- [🚀 프로젝트 개요](#-프로젝트-개요)
  - [📌 주요 기능 및 요구사항 충족 여부](#-주요-기능-및-요구사항-충족-여부)
    - [1. 📝 로그 데이터 생성](#1--로그-데이터-생성)
    - [2. 📊 로그 분석 API](#2--로그-분석-api)
      - [2-1. 📤 로그 파일 업로드 (POST /logs/upload)](#2-1--로그-파일-업로드-post-logsupload)
      - [2-2. 📈 로그 분석 (GET /logs/analyze)](#2-2--로그-분석-get-logsanalyze)
      - [2-3. 🔍 에러 로그 조회 (GET /logs/errors)](#2-3--에러-로그-조회-get-logserrors)
      - [2-4. 🔄 실시간 로그 스트리밍 (GET /logs/stream)](#2-4--실시간-로그-스트리밍-get-logsstream)
  - [🛠 기술 스택](#-기술-스택)
    - [💻 클라이언트](#-클라이언트)
    - [🖥 서버](#-서버)
    - [⚙️ 공통](#️-공통)
  - [🚀 설치 및 실행 방법](#-설치-및-실행-방법)
  - [📌 API 문서](#-api-문서)
    - [**1. 📤 POST /logs/upload**](#1--post-logsupload)
    - [**2. 📈 GET /logs/analyze**](#2--get-logsanalyze)
    - [**3. 🔍 GET /logs/errors**](#3--get-logserrors)
    - [**4. 🔄 GET /logs/stream**](#4--get-logsstream)
  - [📷 스크린샷](#-스크린샷)

# 🚀 프로젝트 개요

Spring Boot 기반 로그 분석 시스템과 React 대시보드를 구현하여, 로그 데이터 생성, 분석, 시각화를 수행하는 과제 테스트입니다.

## 📌 주요 기능 및 요구사항 충족 여부

### 1. 📝 로그 데이터 생성

-   **기능 설명**: Logback을 이용하여 10초 간격으로 로그를 자동 생성
-   **요구사항 체크리스트**:
    -   [x] 10초 간격 자동 로그 생성 구현
    -   [x] 랜덤하게 INFO, ERROR, WARN 로그 출력 구현

### 2. 📊 로그 분석 API

#### 2-1. 📤 로그 파일 업로드 (POST /logs/upload)

-   **기능 설명**: 사용자가 로그 파일을 업로드할 수 있음
-   **요구사항 체크리스트**:
    -   [x] 파일 업로드 기능 구현
    -   [x] 업로드 후 로그 데이터 반영 처리

#### 2-2. 📈 로그 분석 (GET /logs/analyze)

-   **기능 설명**: 전체 로그 개수와 ERROR 로그 개수를 분석하여 반환
-   **요구사항 체크리스트**:
    -   [x] 전체 로그 개수 반환 구현
    -   [x] ERROR 로그 개수 반환 구현

#### 2-3. 🔍 에러 로그 조회 (GET /logs/errors)

-   **기능 설명**: ERROR 및 WARN 로그만 필터링하여 조회
-   **요구사항 체크리스트**:
    -   [x] ERROR, WARN 로그 필터링 구현

#### 2-4. 🔄 실시간 로그 스트리밍 (GET /logs/stream)

-   **기능 설명**: SSE를 활용하여 실시간 로그 스트리밍 제공
-   **요구사항 체크리스트**:
    -   [x] SSE 기반 실시간 데이터 전송 구현

## 🛠 기술 스택

### 💻 클라이언트

|                  |                                                                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| Framework        | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">                                  |
| Language         | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>                       |
| State Management | <img src="https://img.shields.io/badge/zustand-5B4638?style=for-the-badge&logoColor=white">                                          |
| IDE              | <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visualstudiocode&logoColor=white"/> |

### 🖥 서버

|           |                                                                                                                          |
| :-------- | :----------------------------------------------------------------------------------------------------------------------- |
| Framework | <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=SpringBoot&logoColor=white"/>          |
| Language  | <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white"/>                   |
| IDE       | <img src="https://img.shields.io/badge/IntelliJIDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white"/> |

### ⚙️ 공통

|                 |                                                                                                                                                                                                                         |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version Control | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>               |
| Copilot         | <img src="https://img.shields.io/badge/openai-412991.svg?style=for-the-badge&logo=openai&logoColor=white"/> <img src="https://img.shields.io/badge/Cursor-181717.svg?style=for-the-badge&logo=Cursor&logoColor=white"/> |

## 🚀 설치 및 실행 방법

> 클론, 의존성 설치, 실행 방법 등 단계별 지침을 여기에 작성하세요.

## 📌 API 문서

### **1. 📤 POST /logs/upload**

-   **설명**: 로그 파일을 업로드하는 기능
-   **요청 형식**: `multipart/form-data`
-   **요청 데이터**:  
    | 필드 | 타입 | 필수 여부 | 설명 |
    |------|------|--------|------|
    | `file` | `multipart/form-data` | ✅ | 업로드할 로그 파일 (`.log`, `.txt` 지원) |
-   **응답 예시 (`200 OK`)**:
    ```json
    {
        "fileName": "d8b7e3a4-45fa-4dfb-b2a2-8f42b6899f64.log"
    }
    ```

---

### **2. 📈 GET /logs/analyze**

-   **설명**: 전체 로그 개수 및 `ERROR` 로그 개수를 분석
-   **응답 예시 (`200 OK`)**:
    ```json
    {
        "totalLogs": 150,
        "errorLogs": 23
    }
    ```

---

### **3. 🔍 GET /logs/errors**

-   **설명**: 특정 레벨(`ERROR`, `WARN`, `INFO`)의 로그 목록을 조회
-   **응답 예시 (`200 OK`)**:
    ```json
    [
        {
            "timestamp": "2025-02-25T10:39:26",
            "level": "ERROR",
            "className": "c.h.b.d.l.s.LogGeneratorServiceImpl",
            "serviceName": "UserService",
            "message": "Payment failed for order: 55275"
        }
    ]
    ```

---

### **4. 🔄 GET /logs/stream**

-   **설명**: Server-Sent Events (SSE) 기반 실시간 로그 스트리밍

## 📷 스크린샷

> 프로젝트 실행 화면 캡처 이미지 및 설명을 여기에 작성하세요.
