import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LogStats from './LogStats';
import { logService } from '../services/api';

const LogContainer = styled.div`
  padding: 32px 48px;
  max-width: 1600px;
  margin: 0 auto;
  background: #ffffff;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);  // 그림자 제거
  border-radius: 12px;
`;

const LogTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;

  th {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #eef2f6;
    font-size: 14px;
    background-color: #f8fafc;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 10; // z-index 값 증가
  }

  td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #eef2f6;
    font-size: 14px;
    color: #1e293b;
  }

  tbody {
    tr {
      transition: all 0.2s ease;

      &:hover {
        background-color: #f1f5f9;
      }

      &:last-child td {
        border-bottom: none;
      }
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const LogHeader = styled.h1`
  color: #0f172a;
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props) => (props.$isConnected ? '#dcfce7' : '#fee2e2')};
  color: ${(props) => (props.$isConnected ? '#166534' : '#991b1b')};

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${(props) => (props.$isConnected ? '#22c55e' : '#ef4444')};
  }
`;

const LogLevel = styled.span`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  background-color: #f8fafc;
  color: ${(props) => {
    switch (props.level) {
      case 'ERROR':
        return '#ef4444';
      case 'WARN':
        return '#f59e0b';
      case 'INFO':
        return '#3b82f6';
      default:
        return '#64748b';
    }
  }};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  text-align: center;
`;

const TabContainer = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TabButtonContainer = styled.div`
  width: 100%;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: fit-content;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // 그림자 추가
`;

const TabButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${(props) => (props.$active ? '#2563eb' : '#e2e8f0')};
  background-color: ${(props) => (props.$active ? '#eff6ff' : '#ffffff')};
  color: ${(props) => (props.$active ? '#2563eb' : '#64748b')};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${(props) => (props.$active ? '#dbeafe' : '#f8fafc')};
    border-color: ${(props) => (props.$active ? '#2563eb' : '#cbd5e1')};
  }
`;

const TabText = styled.span`
  display: flex;
  align-items: center;

  &::before {
    content: ${(props) => (props.$active ? '"⚡"' : '"⚡"')}; // 실시간은 번개
    margin-right: 8px;
  }
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${(props) => (props.$connected ? '#f0fdf4' : '#fef2f2')};
  margin-top: 8px;
  font-size: 12px;
  color: ${(props) => (props.$connected ? '#166534' : '#991b1b')};
`;

const ConnectionDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$connected ? '#22c55e' : '#ef4444')};
  margin-left: 8px;
  animation: ${(props) => (props.$connected ? 'blink 1.5s ease-in-out infinite' : 'none')};

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  gap: 30px;
  max-width: 1000px;  // 900px에서 1000px로 증가
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 160px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 160px;
`;

const FilterBox = styled.div`
  padding: 12px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LogContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  min-width: 0;
  width: calc(100% - 160px - 0px - 0px); // 전체 너비 - 왼쪽 탭만 고려 (오른쪽 탭 제거)
  margin-left: 16px;
`;

const FilterContainer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
`;

const FilterTag = styled.button`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$selected ? '#2563eb' : '#e2e8f0')};
  background-color: ${(props) => (props.$selected ? '#eff6ff' : '#ffffff')};
  color: ${(props) => (props.$selected ? '#2563eb' : '#64748b')};
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.loading ? 0.5 : 1)};
  cursor: ${(props) => (props.loading ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.$selected ? '#dbeafe' : '#f8fafc')};
    border-color: ${(props) => (props.$selected ? '#2563eb' : '#cbd5e1')};
  }
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;

  &::before {
    content: '⚠️';
    margin-right: 8px;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: hidden; // overflow-y에서 변경
  border: 1px solid #eef2f6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  width: 100%;
  background-color: #f8fafc;
  border-bottom: 1px solid #eef2f6;
`;

const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 180px 90px 180px 300px;  // 메시지 컬럼 250px → 300px
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 1px solid #eef2f6;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TableBody = styled.div`
  overflow-y: auto;
  flex: 1;

  // 스크롤바 스타일링
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;

    &:hover {
      background: #cbd5e1;
    }
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 180px 90px 180px 300px;  // 메시지 컬럼 250px → 300px
  padding: 12px 16px;
  border-bottom: 1px solid #eef2f6;
  transition: all 0.2s ease;
  animation: ${(props) => (props.$isNew ? 'highlight 2s ease-out' : 'none')};
  font-size: 14px;

  > div {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      justify-content: center;
    }

    &:last-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        color: #2563eb;
      }
    }
  }

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  padding: 12px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterError, setFilterError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('realtime');
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [filterLoading, setFilterLoading] = useState(false);
  const [newLogId, setNewLogId] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);

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

        const cleanLogLine = logLine.replace(/^data:/, '').trim();
        if (!cleanLogLine || cleanLogLine === 'data:') return;

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

          setLogs((prevLogs) => {
            const isDuplicate = prevLogs.some(
              (log) =>
                log.timestamp === logEntry.timestamp &&
                log.level === logEntry.level &&
                log.message === logEntry.message
            );

            if (isDuplicate) return prevLogs;

            const newLogs = [...prevLogs, logEntry];
            return newLogs.slice(-20);
          });
        }
      } catch (err) {
        console.error('로그 데이터 파싱 실패:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE 에러:', err);
      setConnected(false);
      setError('서버 연결이 끊어졌습니다. 재연결을 시도합니다...');
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, []);

  // 태그 토글 핸들러
  const handleTagToggle = (level) => {
    if (filterLoading) return;

    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        if (prev.length > 1) {
          return prev.filter((l) => l !== level);
        }
        return prev;
      }
      return [...prev, level];
    });
  };

  const handleMessageClick = (message) => {
    alert(message); // 또는 모달로 표시하거나 다른 방식으로 전체 메시지 표시
  };

  // 테이블 렌더링 함수
  const renderLogTable = (logData) => (
    <TableContainer>
      <TableHeader>
        <TableHeaderRow>
          <div>타임스탬프</div>
          <div>레벨</div>
          <div>서비스</div>
          <div>메시지</div>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(logData) && logData.length > 0 ? (
          logData.map((log, index) => (
            <TableRow key={index} $isNew={log.timestamp === newLogId}>
              <div>{log.timestamp}</div>
              <div>
                <LogLevel level={log.level}>{log.level}</LogLevel>
              </div>
              <div>{log.service}</div>
              <div onClick={() => handleMessageClick(log.message)} title={log.message}>
                {log.message}
              </div>
            </TableRow>
          ))
        ) : (
          <EmptyState>표시할 로그가 없습니다.</EmptyState>
        )}
      </TableBody>
    </TableContainer>
  );

  return (
    <LogContainer>
      <ContentContainer>
        <LeftSection>
          <LogStats />
          <TabButtonContainer>
            <TabButton $active={activeTab === 'realtime'} onClick={() => setActiveTab('realtime')}>
              <TabText $active={activeTab === 'realtime'}>실시간 모니터링</TabText>
              <ConnectionDot $connected={connected} title={connected ? '연결됨' : '연결 끊김'} />
            </TabButton>
            <TabButton $active={activeTab === 'filtered'} onClick={() => setActiveTab('filtered')}>
              <TabText $active={activeTab === 'filtered'}>로그 분석</TabText>
            </TabButton>

            {activeTab === 'filtered' && (
              <FilterContainer>
                <FilterTitle>로그 레벨</FilterTitle>
                <FilterTag
                  $selected={selectedLevels.includes('ERROR')}
                  onClick={() => handleTagToggle('ERROR')}
                  disabled={filterLoading}
                  loading={filterLoading}
                >
                  🚨 ERROR
                </FilterTag>
                <FilterTag
                  $selected={selectedLevels.includes('WARN')}
                  onClick={() => handleTagToggle('WARN')}
                  disabled={filterLoading}
                  loading={filterLoading}
                >
                  ⚠️ WARN
                </FilterTag>
                <FilterTag
                  $selected={selectedLevels.includes('INFO')}
                  onClick={() => handleTagToggle('INFO')}
                  disabled={filterLoading}
                  loading={filterLoading}
                >
                  ℹ️ INFO
                </FilterTag>
              </FilterContainer>
            )}
          </TabButtonContainer>
        </LeftSection>

        <LogContent>
          {activeTab === 'filtered' && filterError && <ErrorMessage>{filterError}</ErrorMessage>}
          {activeTab === 'realtime' && error && <ErrorMessage>{error}</ErrorMessage>}
          {renderLogTable(activeTab === 'realtime' ? logs : filteredLogs)}
        </LogContent>
      </ContentContainer>
    </LogContainer>
  );
};

export default LogViewer;
