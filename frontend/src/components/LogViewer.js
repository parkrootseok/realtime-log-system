import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';
import RealtimeMonitoring from './RealtimeMonitoring';
import UploadMonitoring from './UploadMonitoring';

const LogContainer = styled.div`
  padding: 32px 48px;
  max-width: 100%;
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
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  min-width: 55px;
  text-align: center;

  ${(props) => {
    switch (props.level) {
      case 'ERROR':
        return 'background: #fee2e2; color: #dc2626;';
      case 'WARN':
        return 'background: #fef3c7; color: #d97706;';
      case 'INFO':
        return 'background: #dbeafe; color: #2563eb;';
      default:
        return 'background: #f3f4f6; color: #4b5563;';
    }
  }}
`;

const TabContainer = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TabButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const TabButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background: #f1f5f9;
  }

  background: ${(props) => (props.$active ? '#e2e8f0' : 'transparent')};
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
  display: flex;
  gap: 24px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 240px; // 280px에서 240px로 줄임
`;

const StatsCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
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
  min-width: 0;
  width: 100%;
`;

const FilterContainer = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  width: 100%;
`;

const FilterTitle = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
`;

const FilterTag = styled.div`
  width: 100%;
  padding: 8px 12px;
  margin: 4px 0;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  background: ${(props) => (props.$selected ? '#e2e8f0' : 'transparent')};
  color: ${(props) => (props.$selected ? '#1e293b' : '#64748b')};

  &:hover {
    background: #e2e8f0;
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
  width: 100%;
  min-width: 1200px;
  border: 1px solid #e2e8f0; // 테이블 외곽선 추가
  border-radius: 8px;
  overflow: hidden; // 둥근 모서리 유지를 위해
`;

const TableHeader = styled.div`
  width: 100%;
  background-color: #f8fafc;
  border-bottom: 1px solid #eef2f6;
`;

const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 180px 80px 200px 1fr;
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
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

const TableRow = styled(TableHeaderRow)`
  font-weight: normal;
  background-color: transparent;

  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: 12px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const FileUploadArea = styled.div`
  border: 2px dashed
    ${(props) => (props.$success ? '#22c55e' : props.$error ? '#dc2626' : '#e2e8f0')};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  background-color: ${(props) =>
    props.$success ? '#f0fdf4' : props.$error ? '#fef2f2' : 'transparent'};

  &:hover {
    border-color: ${(props) => (props.$success ? '#16a34a' : props.$error ? '#b91c1c' : '#94a3b8')};
    background-color: ${(props) =>
      props.$success ? '#dcfce7' : props.$error ? '#fee2e2' : '#f8fafc'};
  }
`;

const UploadText = styled.p`
  color: ${(props) => (props.$success ? '#16a34a' : props.$error ? '#b91c1c' : '#64748b')};
  margin: 0;
  font-size: 14px;
`;

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterError, setFilterError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('realtime'); // 'realtime', 'upload'
  const [realtimeSubTab, setRealtimeSubTab] = useState('logs'); // 'logs', 'analysis'
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [filterLoading, setFilterLoading] = useState(false);
  const [newLogId, setNewLogId] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

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

  // 선택된 로그 레벨로 API 호출하는 함수
  const fetchFilteredLogs = async () => {
    if (realtimeSubTab === 'analysis') {
      setFilterLoading(true);
      setFilterError(null);
      try {
        const response = await logService.getErrorLogs(selectedLevels);

        // 로그 문자열을 객체로 파싱하는 함수
        const parseLogString = (logStr) => {
          const match = logStr.match(/^(\S+\s+\S+)\s+(\w+)\s+\[(.*?)\]\s*-\s*(.*)$/);
          if (match) {
            return {
              timestamp: match[1],
              level: match[2],
              service: match[3],
              message: match[4].trim(),
            };
          }
          return null;
        };

        // 로그 문자열 배열을 객체 배열로 변환
        const parsedLogs = response.data.data.logs
          .map(parseLogString)
          .filter((log) => log !== null);

        setFilteredLogs(parsedLogs);
      } catch (err) {
        console.error('API 에러:', err);
        setFilterError('로그 조회 중 오류가 발생했습니다.');
        setFilteredLogs([]);
      } finally {
        setFilterLoading(false);
      }
    }
  };

  // 로그 레벨 선택이 변경될 때마다 API 호출
  useEffect(() => {
    if (realtimeSubTab === 'analysis' && selectedLevels.length > 0) {
      console.log('API 호출 시작 - 선택된 레벨:', selectedLevels);
      fetchFilteredLogs();
    }
  }, [selectedLevels, realtimeSubTab]);

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
              <TableCell>{log.timestamp}</TableCell>
              <TableCell>
                <LogLevel level={log.level}>{log.level}</LogLevel>
              </TableCell>
              <TableCell>{log.service}</TableCell>
              <TableCell onClick={() => handleMessageClick(log.message)} title={log.message}>
                {log.message}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <EmptyState>표시할 로그가 없습니다.</EmptyState>
        )}
      </TableBody>
    </TableContainer>
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadStatusChange = ({ success, error }) => {
    setUploadSuccess(success);
    setUploadError(error);
  };

  return (
    <LogContainer>
      <ContentContainer>
        <LeftSection>
          <TabButtonContainer>
            <TabButton $active={activeTab === 'realtime'} onClick={() => setActiveTab('realtime')}>
              <TabText $active={activeTab === 'realtime'}>실시간 로그 분석</TabText>
              <ConnectionDot $connected={connected} title={connected ? '연결됨' : '연결 끊김'} />
            </TabButton>
            <TabButton $active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
              <TabText $active={activeTab === 'upload'}>업로드 로그 분석</TabText>
            </TabButton>
          </TabButtonContainer>

          {activeTab === 'upload' && (
            <label htmlFor="log-file-upload">
              <FileUploadArea $success={uploadSuccess} $error={uploadError}>
                <UploadText $success={uploadSuccess} $error={uploadError}>
                  {uploadedFile
                    ? `선택된 파일: ${uploadedFile.name}`
                    : '로그 파일을 드래그하거나\n클릭하여 업로드하세요'}
                </UploadText>
              </FileUploadArea>
              <input
                id="log-file-upload"
                type="file"
                accept=".log,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </LeftSection>

        <LogContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {activeTab === 'realtime' && <RealtimeMonitoring logs={logs} />}
          {activeTab === 'upload' && (
            <UploadMonitoring
              uploadedFile={uploadedFile}
              onUploadStatusChange={handleUploadStatusChange}
            />
          )}
        </LogContent>
      </ContentContainer>
    </LogContainer>
  );
};

export default LogViewer;
