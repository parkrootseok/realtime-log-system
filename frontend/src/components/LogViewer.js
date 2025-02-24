import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LogStats from './LogStats';

const LogContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const LogHeader = styled.h1`
  color: #333;
  display: flex;
  align-items: center;
  margin: 0;
`;

const StatusIndicator = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 10px;
  background-color: ${(props) => (props.$isConnected ? '#4CAF50' : '#f44336')};
`;

const LogLevel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => {
    switch (props.level) {
      case 'ERROR':
        return '#f44336';
      case 'WARN':
        return '#ff9800';
      case 'INFO':
        return '#2196f3';
      default:
        return '#757575';
    }
  }};
`;

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/logs/stream`);

    eventSource.onopen = () => {
      setConnected(true);
      setLoading(false);
    };

    eventSource.onmessage = (event) => {
      try {
        const logLine = event.data;
        if (!logLine) return;

        // "data:" 접두사 제거 및 빈 줄 필터링
        const cleanLogLine = logLine.replace(/^data:/, '').trim();
        if (!cleanLogLine || cleanLogLine === 'data:') return; // 빈 데이터 무시

        // 로그 문자열 파싱
        const match = cleanLogLine.match(
          /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (\w+)\s+\[([^\]]+)\] - \[([^\]]+)\] - (.+)$/
        );

        if (match) {
          const [, timestamp, level, , service, message] = match;
          const logEntry = {
            timestamp,
            level,
            service: service.trim(),
            message: message.trim(),
          };

          // 중복 로그 방지를 위한 체크
          setLogs((prevLogs) => {
            // 이미 같은 내용의 로그가 있는지 확인
            const isDuplicate = prevLogs.some(
              (log) =>
                log.timestamp === logEntry.timestamp &&
                log.level === logEntry.level &&
                log.message === logEntry.message
            );

            if (isDuplicate) return prevLogs;

            const newLogs = [...prevLogs, logEntry];
            return newLogs.slice(-20); // 최근 20개만 유지
          });
        }
      } catch (err) {
        /* eslint-disable no-console */
        console.error('로그 데이터 파싱 실패:', err);
        console.error('원본 데이터:', event.data); // 디버깅을 위한 원본 데이터 출력
        /* eslint-enable no-console */
      }
    };

    eventSource.onerror = (err) => {
      // eslint-disable-next-line no-console
      console.error('SSE 에러:', err);
      setConnected(false);
      setError('서버 연결이 끊어졌습니다. 재연결을 시도합니다...');
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, []);

  if (loading) return <div>연결 중...</div>;

  return (
    <LogContainer>
      <HeaderContainer>
        <LogHeader>
          시스템 로그
          <StatusIndicator $isConnected={connected} title={connected ? '연결됨' : '연결 끊김'} />
        </LogHeader>
        <LogStats />
      </HeaderContainer>

      {error && <div style={{ color: '#f44336', marginBottom: '10px' }}>{error}</div>}

      <LogTable>
        <thead>
          <tr>
            <th>타임스탬프</th>
            <th>레벨</th>
            <th>서비스</th>
            <th>메시지</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>
                <LogLevel level={log.level}>{log.level}</LogLevel>
              </td>
              <td>{log.service}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </LogTable>
    </LogContainer>
  );
};

export default LogViewer;
