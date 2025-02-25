import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';
import RealtimeMonitoring from './RealtimeMonitoring';
import UploadMonitoring from './UploadMonitoring';
import useUIStore from '../stores/uiStore';
import useUploadStore from '../stores/uploadStore';
import useRealtimeStore from '../stores/realtimeStore';
import { parseLogString } from '../utils/logParser';

const LogContainer = styled.div`
  padding: 32px 48px;
  max-width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;

const LeftSection = styled.div`
  width: 240px;
  flex-shrink: 0;
`;

const LogContent = styled.div`
  flex: 1;
`;

const TabButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.$active ? '#f1f5f9' : 'transparent')};
  color: ${(props) => (props.$active ? '#0f172a' : '#64748b')};
  font-weight: ${(props) => (props.$active ? '600' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const TabText = styled.span`
  font-size: 14px;
`;

const ConnectionDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$connected ? '#22c55e' : '#ef4444')};
`;

const FileUploadArea = styled.div`
  border: 2px dashed
    ${(props) => (props.$success ? '#22c55e' : props.$error ? '#dc2626' : '#e2e8f0')};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
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
  white-space: pre-line;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const LogViewer = () => {
  const { activeTab, setActiveTab } = useUIStore();
  const {
    uploadedFile,
    uploadSuccess,
    uploadError,
    setUploadedFile,
    setUploadSuccess,
    setUploadError,
    resetStats,
  } = useUploadStore();
  const { connected, error, logs, setConnected, setError, addLog, setLogs, resetRealtimeState } =
    useRealtimeStore();

  // 탭 변경 시 파일 상태 유지를 위한 ref 추가
  const lastUploadedFileRef = useRef(null);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handleUploadStatusChange = ({ success, error }) => {
    if (success) {
      setUploadSuccess(true);
      lastUploadedFileRef.current = uploadedFile;
    } else {
      setUploadError(error || '업로드에 실패했습니다.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      lastUploadedFileRef.current = null;
      setUploadedFile(file);
    }
  };

  const handleOtherFileUpload = () => {
    lastUploadedFileRef.current = null;
    setUploadedFile(null);
    setUploadSuccess(false);
    setUploadError(null);
    
    // uploadStore의 상태 초기화
    resetStats();
    setUploadedFile(null); // uploadStore의 uploadedFile 초기화
  };

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/log/ws-stream`);

    const sendMessage = (type) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type }));
      }
    };

    const processLog = (logData) => {
      if (!logData) return null;

      try {
        let formattedTimestamp;
        if (Array.isArray(logData.timestamp)) {
          const [year, month, day, hour, minute, second] = logData.timestamp;
          formattedTimestamp = new Date(year, month - 1, day, hour, minute, second);
        } else if (typeof logData.timestamp === 'string') {
          formattedTimestamp = new Date(logData.timestamp);
        } else {
          formattedTimestamp = new Date();
        }

        const uniqueId = `${formattedTimestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`;

        return {
          ...logData,
          timestamp: formattedTimestamp,
          id: uniqueId,
          serviceName: logData.serviceName || 'Unknown',
          level: logData.level || 'INFO',
          message: logData.message || 'No message',
        };
      } catch (error) {
        console.error('로그 처리 중 오류 발생:', error);
        return null;
      }
    };

    ws.onopen = () => {
      console.log('WebSocket 연결 성공!');
      setConnected(true);
      setError(null);
      sendMessage('sendInitialLogs');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          const formattedLogs = data.map(processLog).filter((log) => log !== null);
          setLogs(formattedLogs);
        } else {
          const formattedLog = processLog(data);
          if (formattedLog) {
            addLog(formattedLog);
          }
        }
      } catch (error) {
        console.error('로그 파싱 에러:', error);
        console.error('원본 데이터:', event.data);
        setError('로그 데이터 처리 중 오류가 발생했습니다.');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket 에러 발생:', error);
      setConnected(false);
      setError('WebSocket 연결 중 오류가 발생했습니다.');
    };

    ws.onclose = (event) => {
      setConnected(false);
    };

    return () => {
      console.log('컴포넌트 언마운트, WebSocket 정리...');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      resetRealtimeState();
    };
  }, []);

  return (
    <LogContainer>
      <ContentContainer>
        <LeftSection>
          <TabButtonContainer>
            <TabButton
              $active={activeTab === 'realtime'}
              onClick={() => handleTabChange('realtime')}
            >
              <TabText>실시간 로그 분석</TabText>
              <ConnectionDot $connected={connected} title={connected ? '연결됨' : '연결 끊김'} />
            </TabButton>
            <TabButton $active={activeTab === 'upload'} onClick={() => handleTabChange('upload')}>
              <TabText>업로드 로그 분석</TabText>
            </TabButton>
          </TabButtonContainer>

          {activeTab === 'upload' && (
            <>
              {!uploadedFile ? (
                <label htmlFor="log-file-upload">
                  <FileUploadArea $success={uploadSuccess} $error={uploadError}>
                    <UploadText $success={uploadSuccess} $error={uploadError}>
                      로그 파일을 업로드하세요
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
              ) : (
                <FileUploadArea $success={uploadSuccess} $error={uploadError}>
                  <UploadText>현재 파일: {uploadedFile.name}</UploadText>
                  <button
                    onClick={handleOtherFileUpload}
                    style={{
                      marginTop: '8px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    다른 파일 업로드
                  </button>
                </FileUploadArea>
              )}
            </>
          )}
        </LeftSection>

        <LogContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {activeTab === 'realtime' ? (
            <RealtimeMonitoring logs={logs} />
          ) : (
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
