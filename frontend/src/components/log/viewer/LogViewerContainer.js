import React, { useEffect } from 'react';
import styled from 'styled-components';
import useUIStore from '../../../stores/uiStore';
import useUploadStore from '../../../stores/uploadStore';
import useRealtimeStore from '../../../stores/realtimeStore';
import LogViewerTabs from './LogViewerTabs';
import LogViewerContent from './LogViewerContent';

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

const LogViewerContainer = () => {
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

  const {
    connected,
    error,
    logs,
    setConnected,
    setError,
    addLog,
    setLogs,
    resetRealtimeState,
    initSocket,
  } = useRealtimeStore();

  useEffect(() => {
    const wsUrl = `${process.env.REACT_APP_WS_URL}/log/ws-stream`;
    const socket = initSocket(wsUrl);

    const sendMessage = (type) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type }));
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      setConnected(true);
      setError(null);
      sendMessage('sendInitialLogs');
    }

    socket.onopen = () => {
      console.log('WebSocket 연결 성공!');
      setConnected(true);
      setError(null);
      sendMessage('sendInitialLogs');
    };

    socket.onmessage = (event) => {
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
        setError('로그 데이터 처리 중 오류가 발생했습니다.');
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket 에러 발생:', error);
      setConnected(false);
      setError('WebSocket 연결 중 오류가 발생했습니다.');
    };

    socket.onclose = () => {
      setConnected(false);
    };

    return () => {
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
    };
  }, []);

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

  return (
    <LogContainer>
      <ContentContainer>
        <LogViewerTabs activeTab={activeTab} setActiveTab={setActiveTab} connected={connected} />
        <LogViewerContent
          activeTab={activeTab}
          logs={logs}
          uploadedFile={uploadedFile}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
          connected={connected}
          error={error}
        />
      </ContentContainer>
    </LogContainer>
  );
};

export default LogViewerContainer;
