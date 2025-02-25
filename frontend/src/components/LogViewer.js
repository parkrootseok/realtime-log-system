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
  } = useUploadStore();
  const { connected, error, logs, setConnected, setError, addLog, resetRealtimeState } =
    useRealtimeStore();

  // 탭 변경 시 파일 상태 유지를 위한 ref 추가
  const lastUploadedFileRef = useRef(null);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // 업로드 탭으로 돌아올 때 마지막 업로드된 파일 상태 복원
    if (newTab === 'upload' && lastUploadedFileRef.current) {
      setUploadedFile(lastUploadedFileRef.current);
    }
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
  };

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/logs/stream`);

    eventSource.onopen = () => {
      setConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const logData = JSON.parse(event.data);
        if (logData.timestamp) {
          addLog(logData);
        }
      } catch (error) {
        console.error('로그 파싱 에러:', error);
      }
    };

    eventSource.onerror = (error) => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
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
