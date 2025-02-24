import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';
import RealtimeMonitoring from './RealtimeMonitoring';
import UploadMonitoring from './UploadMonitoring';
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
  const [activeTab, setActiveTab] = useState('realtime');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/logs/stream`);

    eventSource.onopen = () => {
      setConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedLog = parseLogString(event.data);

        if (parsedLog.timestamp) {
          setLogs((prevLogs) => {
            const newLogs = [...prevLogs, parsedLog];
            return newLogs.slice(-20);
          });
        }
      } catch (error) {
        console.error('로그 파싱 에러:', error);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      setError('서버 연결이 끊어졌습니다. 재연결을 시도합니다...');
    };

    return () => eventSource.close();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadSuccess(false);
      setUploadError(false);
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
              <TabText>실시간 로그 분석</TabText>
              <ConnectionDot $connected={connected} title={connected ? '연결됨' : '연결 끊김'} />
            </TabButton>
            <TabButton $active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
              <TabText>업로드 로그 분석</TabText>
            </TabButton>
          </TabButtonContainer>

          {activeTab === 'upload' && !uploadedFile && (
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
          )}

          {activeTab === 'upload' && uploadedFile && (
            <div>
              <UploadText>현재 파일: {uploadedFile.name}</UploadText>
              <button onClick={() => setUploadedFile(null)}>다른 파일 업로드</button>
            </div>
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
