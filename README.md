# 제품팀 과제테스트

## 목차

- [제품팀 과제테스트](#제품팀-과제테스트)
  - [목차](#목차)
  - [프로젝트 개요](#프로젝트-개요)
  - [주요 기능 및 요구사항 충족 여부](#주요-기능-및-요구사항-충족-여부)
    - [1. 로그 데이터 생성](#1-로그-데이터-생성)
    - [2. 로그 분석 API](#2-로그-분석-api)
      - [2-1. 로그 파일 업로드 (POST /logs/upload)](#2-1-로그-파일-업로드-post-logsupload)
      - [2-2. 로그 분석 (GET /logs/analyze)](#2-2-로그-분석-get-logsanalyze)
      - [2-3. 에러 로그 조회 (GET /logs/errors)](#2-3-에러-로그-조회-get-logserrors)
      - [2-4. 실시간 로그 스트리밍 (GET /logs/stream)](#2-4-실시간-로그-스트리밍-get-logsstream)
    - [3. 웹 UI](#3-웹-ui)
  - [사용 기술](#사용-기술)
    - [클라이언트](#클라이언트)
    - [서버](#서버)
    - [공통](#공통)
  - [설치 및 실행 방법](#설치-및-실행-방법)
  - [API 문서](#api-문서)
    - [1. POST /logs/upload](#1-post-logsupload)
    - [2. GET /logs/analyze](#2-get-logsanalyze)
    - [3. GET /logs/errors](#3-get-logserrors)
    - [4. GET /logs/stream](#4-get-logsstream)
  - [웹 UI 설명](#웹-ui-설명)
  - [AI 도구 활용](#ai-도구-활용)
    - [클라이언트](#클라이언트-1)
      - [1. Cursor AI 기반 프론트엔드 초기 설정](#1-cursor-ai-기반-프론트엔드-초기-설정)
      - [2. 실시간 로그 조회 페이지 구현](#2-실시간-로그-조회-페이지-구현)
      - [3. 로그 분석 페이지 구현](#3-로그-분석-페이지-구현)
      - [4. 로그 필터링 페이지 구현](#4-로그-필터링-페이지-구현)
      - [5. 파일 업로드 페이지 구현](#5-파일-업로드-페이지-구현)
      - [6. 코드 리팩토링](#6-코드-리팩토링)
    - [서버](#서버-1)
      - [1. SSE를 활용한 실시간 로그 조회 API 구현 및 CORS 해결](#1-sse를-활용한-실시간-로그-조회-api-구현-및-cors-해결)
      - [2. 클린 아키텍처 적용을 위한 코드 리팩토링 수행](#2-클린-아키텍처-적용을-위한-코드-리팩토링-수행)
    - [공통](#공통-1)
      - [1. Issue 및 PR 템플릿 참고하여 작업 내용 정리](#1-issue-및-pr-템플릿-참고하여-작업-내용-정리)
  - [Docker 지원](#docker-지원)
  - [스크린샷](#스크린샷)

## 프로젝트 개요

Spring Boot 기반 로그 분석 시스템과 React 대시보드를 구현하여, 로그 데이터 생성, 분석, 시각화를 수행하는 과제 테스트입니다.

## 주요 기능 및 요구사항 충족 여부

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

-   **기능 설명**: SSE를 활용하여 실시간 로그 스트리밍 제공
-   **요구사항 체크리스트**:
    -   [x] SSE 기반 실시간 데이터 전송 구현

### 3. 웹 UI

-   **기능 설명**: 단일 페이지에서 로그 분석 결과를 시각화
-   **요구사항 체크리스트**:
    -   [x] 최신 로그 20개 테이블 표시 구현
    -   [x] 에러 로그 개수 차트 (예: Bar Chart) 구현
    -   [x] 로그 검색 및 필터링 기능 구현

## 사용 기술

### 클라이언트

|                  |                                                                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| Framework        | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">                                  |
| Language         | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>                       |
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

## 설치 및 실행 방법

> 클론, 의존성 설치, 실행 방법 등 단계별 지침을 여기에 작성하세요.

## API 문서

### 1. POST /logs/upload

-   **설명**: 로그 파일 업로드 기능

### 2. GET /logs/analyze

-   **설명**: 전체 로그 및 ERROR 로그 개수 분석

### 3. GET /logs/errors

-   **설명**: ERROR, WARN 로그 필터링 조회

### 4. GET /logs/stream

-   **설명**: WebSocket 기반 실시간 로그 스트리밍

## 웹 UI 설명

> 대시보드 구성, 테이블/차트, 검색 및 필터링 등 UI 구성 요소에 대해 작성하세요.

## AI 도구 활용

### 클라이언트

#### 1. Cursor AI 기반 프론트엔드 초기 설정
- **React 프로젝트 생성**  
  React 앱 초기화로 프로젝트를 시작함.
- **패키지 설치**  
  `@mui/material`, `styled-components`, `recharts`, `axios` 등 필요한 패키지를 설치.
- **프로젝트 구조 설정**  
  코드 유지보수를 위해 `components`, `services`, `styles` 등으로 디렉토리 구성.
- **스타일링 설정**  
  전역 스타일(`GlobalStyle`)과 테마(`theme`)를 설정하여 일관된 디자인 적용.
- **API 기본 구조 구축**  
  백엔드와의 통신을 위한 API 서비스 구조를 마련.
- **코드 품질 도구 설정**  
  Prettier, ESlint, 환경 변수(.env), .gitignore 등을 설정하여 코드 품질 및 관리 효율성을 향상.

#### 2. 실시간 로그 조회 페이지 구현
- **SSE 연결**  
  서버의 SSE를 활용해 실시간 로그 데이터를 수신하는 페이지 구현.

#### 3. 로그 분석 페이지 구현
- **페이지 개발**  
  로그 분석 결과를 시각적으로 표현하는 페이지를 제작.

#### 4. 로그 필터링 페이지 구현
- **필터링 기능 구현**  
  사용자 로그 검색 및 필터링 기능을 추가.

#### 5. 파일 업로드 페이지 구현
- **문제 해결**  
  파일 업로드 시 중복 호출 문제를 커서 AI를 활용한 상태 관리 리팩토링으로 해결.

#### 6. 코드 리팩토링
- **상태 관리 개선**  
  Zustand 라이브러리로 전환하여 상태 관리를 개선하고 코드 가독성 및 유지보수성 향상.

### 서버

#### 1. SSE를 활용한 실시간 로그 조회 API 구현 및 CORS 해결
- **SSE API 구현**  
  SSE를 통해 실시간 로그 데이터를 제공하는 API를 구축.
- **CORS 문제 해결**  
  클라이언트-서버 간 원활한 통신을 위해 CORS 이슈를 해결.

#### 2. 클린 아키텍처 적용을 위한 코드 리팩토링 수행
- **초기 구현**  
  초기에는 모든 로직을 Controller에 집중하여 구현함.
- **리팩토링**  
  이후 클린 아키텍처 원칙을 적용, Controller를 분리 및 재구성하여 코드 구조 개선.

### 공통

#### 1. Issue 및 PR 템플릿 참고하여 작업 내용 정리
- **문서화**  
  Issue와 PR 템플릿을 참고하여 작업 내용을 체계적으로 정리하고 문서화함.

## Docker 지원

> Dockerfile 및 Docker Compose 사용 방법 기재 (필요시)

## 스크린샷

> 프로젝트 실행 화면 캡처 이미지 및 설명을 여기에 작성하세요.
