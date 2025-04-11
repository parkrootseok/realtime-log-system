import { useState, useEffect, useCallback, useRef } from 'react';
import useRealtimeStore from '../stores/realtimeStore';

// 소켓 URL 설정
const getSocketUrl = () => {
  // 환경 변수에서 URL 가져오기 (없으면 기본값 사용)
  const baseUrl = process.env.REACT_APP_SOCKET_URL || 'localhost:8080';
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${baseUrl}/log/ws-stream`;
};

// 개발 모드 확인
const isDev = process.env.NODE_ENV === 'development';

// 테스트 데이터 생성 함수
const generateTestLogs = (count = 10) => {
  // 유효한 count 값 보장 (음수나 너무 큰 값 방지)
  const safeCount = Math.min(Math.max(1, count), 100);

  const levels = ['INFO', 'WARN', 'ERROR'];
  const services = [
    'UserService',
    'PaymentService',
    'AuthService',
    'ApiService',
    'DatabaseService',
  ];
  const messages = [
    '요청 처리 완료',
    '사용자 인증 성공',
    '데이터베이스 연결 실패',
    '결제 처리 중 오류 발생',
    'API 요청 타임아웃',
    '세션 만료',
    '권한 부족',
    '데이터 검증 실패',
    '캐시 갱신 완료',
    '작업 스케줄링 성공',
  ];

  return Array.from({ length: safeCount }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 3600000));

    return {
      id: `test-${i}`,
      timestamp,
      level,
      serviceName: services[Math.floor(Math.random() * services.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      details: `테스트 로그 항목 #${i + 1}`,
    };
  });
};

const useLogSocket = () => {
  const [logData, setLogData] = useState([]);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const testModeRef = useRef(false);
  const { setConnected, setError: setStoreError, addLog, setLogs } = useRealtimeStore();

  const processLog = useCallback((logData) => {
    try {
      if (!logData || typeof logData !== 'object') {
        return null;
      }

      const timestamp = logData.timestamp ? new Date(logData.timestamp) : new Date();

      const level = logData.level ? logData.level.toUpperCase() : 'INFO';

      return {
        ...logData,
        timestamp,
        level,
      };
    } catch (err) {
      return null;
    }
  }, []);

  const connectSocket = useCallback(() => {
    // 이미 연결 중이거나 연결된 소켓이 있으면 닫기
    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.CONNECTING ||
        socketRef.current.readyState === WebSocket.OPEN)
    ) {
      socketRef.current.close();
    }

    try {
      const wsUrl = getSocketUrl();
      socketRef.current = new WebSocket(wsUrl);
      setSocketStatus('connecting');

      socketRef.current.onopen = () => {
        setIsConnected(true);
        setConnected(true);
        setError(null);
        setStoreError(null);
        setSocketStatus('connected');
        reconnectAttemptsRef.current = 0;

        // 초기 로그 요청
        socketRef.current.send(JSON.stringify({ type: 'sendInitialLogs' }));
      };

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (Array.isArray(data)) {
            const formattedLogs = data.map(processLog).filter((log) => log !== null);
            // 서버에서 이미 정렬된 데이터를 받으므로 그대로 사용
            const limitedLogs = formattedLogs.slice(0, 20);
            setLogs(limitedLogs);
            setLogData(limitedLogs);
          } else if (data && typeof data === 'object') {
            const formattedLog = processLog(data);

            if (formattedLog) {
              addLog(formattedLog);
              // 새 로그를 앞에 추가하고, 20개를 초과하면 가장 오래된 로그 제거
              setLogData((prev) => {
                const newLogs = [formattedLog, ...prev];
                return newLogs.length > 20 ? newLogs.slice(0, 20) : newLogs;
              });
            }
          } else {
            // 예상치 못한 데이터 형식 처리
          }
        } catch (err) {
          setError('로그 데이터 처리 중 오류가 발생했습니다.');
          setStoreError('로그 데이터 처리 중 오류가 발생했습니다.');
        }
      };

      socketRef.current.onerror = (err) => {
        setError('WebSocket 연결 오류가 발생했습니다.');
        setStoreError('WebSocket 연결 오류가 발생했습니다.');
        setSocketStatus('error');
      };

      socketRef.current.onclose = (event) => {
        setIsConnected(false);
        setConnected(false);
        setSocketStatus('disconnected');

        // 비정상 종료인 경우 재연결 시도
        if (event.code !== 1000 && event.code !== 1001) {
          attemptReconnect();
        }
      };
    } catch (err) {
      setError(`WebSocket 생성 오류: ${err.message}`);
      setStoreError(`WebSocket 생성 오류: ${err.message}`);
      setSocketStatus('error');
      attemptReconnect();
    }
  }, [setConnected, setStoreError, setLogs, addLog, processLog]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setError('최대 재연결 시도 횟수에 도달했습니다. 페이지를 새로고침해 주세요.');
      setStoreError('최대 재연결 시도 횟수에 도달했습니다. 페이지를 새로고침해 주세요.');

      // 개발 모드에서 테스트 데이터 생성
      if (isDev && !testModeRef.current) {
        testModeRef.current = true;
        // 정확히 20개의 테스트 로그 생성
        const testLogs = generateTestLogs(20).reverse();
        setLogData(testLogs);
        setLogs(testLogs);

        // 주기적으로 새 로그 추가
        const testInterval = setInterval(() => {
          if (testModeRef.current) {
            const newLog = generateTestLogs(1)[0];
            addLog(newLog);
            // 새 로그를 앞에 추가하고, 20개를 초과하면 가장 오래된 로그 제거
            setLogData((prev) => {
              const newLogs = [newLog, ...prev];
              return newLogs.length > 20 ? newLogs.slice(0, 20) : newLogs;
            });
          } else {
            clearInterval(testInterval);
          }
        }, 5000);

        return;
      }
    }

    // 지수 백오프로 재연결 시간 계산 (1초, 2초, 4초, 8초, 16초)
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current += 1;
      connectSocket();
    }, delay);
  }, [connectSocket, setStoreError, setLogs, addLog]);

  // 컴포넌트 마운트 시 소켓 연결
  useEffect(() => {
    connectSocket();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connectSocket]);

  // 수동 재연결 함수
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;

    // 기존 재연결 타이머 취소
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // 기존 소켓 정리
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (err) {
        // 소켓 닫기 오류 처리
      }
    }

    // 새 연결 시도
    setTimeout(connectSocket, 100);
  }, [connectSocket]);

  // 테스트 모드 활성화 함수
  const enableTestMode = useCallback(() => {
    if (testModeRef.current) return;

    testModeRef.current = true;

    // 소켓 연결 종료
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (err) {
        // 소켓 닫기 오류 처리
      }
    }

    // 테스트 데이터 설정 - 정확히 20개 생성하고 최신순으로 정렬
    const testLogs = generateTestLogs(20).reverse();
    setLogData(testLogs);
    setLogs(testLogs);

    // 주기적으로 새 로그 추가
    const testInterval = setInterval(() => {
      if (testModeRef.current) {
        const newLog = generateTestLogs(1)[0];
        addLog(newLog);
        // 새 로그를 앞에 추가하고, 20개를 초과하면 가장 오래된 로그 제거
        setLogData((prev) => {
          const newLogs = [newLog, ...prev];
          return newLogs.length > 20 ? newLogs.slice(0, 20) : newLogs;
        });
      } else {
        clearInterval(testInterval);
      }
    }, 5000);

    return () => {
      clearInterval(testInterval);
      testModeRef.current = false;
    };
  }, [setLogs, addLog]);

  // 테스트 모드 비활성화 함수
  const disableTestMode = useCallback(() => {
    if (!testModeRef.current) return;

    testModeRef.current = false;
    setLogData([]);
    setLogs([]);
    reconnect();
  }, [reconnect, setLogs]);

  return {
    logData,
    socketStatus,
    isConnected,
    error,
    reconnect,
    socketRef,
    enableTestMode,
    disableTestMode,
    isTestMode: testModeRef.current,
  };
};

export default useLogSocket;
