import React, { useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Pagination,
  Button,
  Typography,
  TextField,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import { logService } from '../../services/api';
import {
  TableContainer,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableCell,
  TableBody,
  EmptyState,
} from '../common/table/Table';
import { LogLevel } from '../common/loglevel/LogLevel';
import RealtimeLogStatus from './RealtimeLogStatus';
import LogLevelFilter from '../common/loglevel/LogLevelFilter';
import useRealtimeStore from '../../stores/realtimeStore';
import LogAnalysis from '../LogAnalysis';
import useLogSocket from '../../hooks/useLogSocket';

const MonitoringContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  height: 100%;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const LocalTableContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 16px;
`;

const LocalTableHeader = styled.div`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const LocalTableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 180px 100px 150px 1fr;
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
`;

const LocalTableBody = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const LocalTableRow = styled.div`
  display: grid;
  grid-template-columns: 180px 100px 150px 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;

  &:hover {
    background-color: #f1f5f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LocalTableCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogTable = React.memo(
  ({ logs = [] }) => {
    const validLogs = Array.isArray(logs) ? logs : [];

    return (
      <TableContainer style={{ height: '500px' }}>
        <TableHeader>
          <TableHeaderRow>
            <div>발생시각</div>
            <div>레벨</div>
            <div>발생위치</div>
            <div>메시지</div>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {validLogs.length > 0 ? (
            validLogs.map((log, index) => {
              if (!log) return null;

              let timestamp;
              try {
                timestamp =
                  typeof log.timestamp === 'string'
                    ? new Date(log.timestamp)
                    : log.timestamp instanceof Date
                      ? log.timestamp
                      : new Date();
              } catch (error) {
                // 타임스탬프 형식 오류 시 현재 시간 사용
                timestamp = new Date();
              }

              return (
                <TableRow key={`log-${index}`}>
                  <TableCell>{timestamp.toLocaleString()}</TableCell>
                  <TableCell>
                    <LogLevel $level={log.level || 'INFO'}>{log.level || 'INFO'}</LogLevel>
                  </TableCell>
                  <TableCell>{log.serviceName || '-'}</TableCell>
                  <TableCell>{log.message || '-'}</TableCell>
                </TableRow>
              );
            })
          ) : (
            <EmptyState>로그 데이터가 없습니다.</EmptyState>
          )}
        </TableBody>
      </TableContainer>
    );
  },
  (prevProps, nextProps) => {
    const getLastTimestamp = (logs) => {
      if (!logs || logs.length === 0) return null;
      const lastLog = logs[logs.length - 1];
      if (!lastLog || !lastLog.timestamp) return null;

      try {
        return typeof lastLog.timestamp === 'string'
          ? new Date(lastLog.timestamp).getTime()
          : lastLog.timestamp.getTime();
      } catch (error) {
        return null;
      }
    };

    return (
      prevProps.logs?.length === nextProps.logs?.length &&
      getLastTimestamp(prevProps.logs) === getLastTimestamp(nextProps.logs)
    );
  }
);

LogTable.displayName = 'LogTable';

// 개발 모드 확인
const isDev = process.env.NODE_ENV === 'development';

const RealtimeMonitoring = ({ logs }) => {
  const {
    activeTab,
    selectedLevels,
    filteredLogs,
    filterLoading,
    setActiveTab,
    setSelectedLevels,
    setFilteredLogs,
    setFilterLoading,
    setFilterError,
    logStats,
    updateLogStats,
  } = useRealtimeStore();

  const {
    logData,
    isConnected,
    socketStatus,
    error: socketError,
    reconnect,
    socketRef,
    enableTestMode,
    disableTestMode,
    isTestMode,
  } = useLogSocket();

  const [testModeEnabled, setTestModeEnabled] = useState(false);

  // 디버깅용 console.log 제거
  useEffect(() => {
    // 소켓 상태 변경 시 스토어 업데이트만 수행
    if (useRealtimeStore.getState().connected !== isConnected) {
      useRealtimeStore.getState().setConnected(isConnected);
    }
  }, [isConnected, socketStatus, socketError]);

  useEffect(() => {
    // 로그 데이터 변경 시 스토어 업데이트만 수행
    if (logData && logData.length > 0) {
      useRealtimeStore.getState().setLogs(logData);
    }
  }, [logData]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);
  const [realtimeOptions, setRealtimeOptions] = useState({
    refreshInterval: 60000,
    chartType: 'line',
    timeRange: 'day',
  });

  const handleStatsChange = (newStats) => {
    updateLogStats(newStats);
  };

  const fetchRealtimeStats = async () => {
    try {
      const stats = await logService.analyzeLogs('', 'ERROR,WARN,INFO');
      updateLogStats({
        totalLogsCount: stats.totalLines || 0,
        errorCount: stats.errorCount || 0,
        infoCount: stats.infoCount || 0,
        warnCount: stats.warnCount || 0,
      });
    } catch (err) {
      // 오류 발생 시 조용히 처리
    }
  };

  const fetchFilteredLogs = async () => {
    if (activeTab !== 2) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(undefined, selectedLevels, page, pageSize);
      setFilteredLogs(response.data.data.logs);
      setTotalPages(Math.ceil(response.data.data.totalElements / pageSize));
    } catch (err) {
      setFilterError('로그 조회 중 오류가 발생했습니다.');
      setFilteredLogs([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleTagToggle = (level) => {
    if (filterLoading) return;
    const currentLevels = Array.isArray(selectedLevels)
      ? selectedLevels
      : ['ERROR', 'WARN', 'INFO'];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.length > 1
        ? currentLevels.filter((l) => l !== level)
        : currentLevels
      : [...currentLevels, level];
    setSelectedLevels(newLevels);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  useEffect(() => {
    fetchRealtimeStats();
    const intervalId = setInterval(fetchRealtimeStats, realtimeOptions.refreshInterval);
    return () => clearInterval(intervalId);
  }, [realtimeOptions.refreshInterval]);

  useEffect(() => {
    if (activeTab === 2) {
      fetchFilteredLogs();
    }
  }, [activeTab, selectedLevels, page]);

  const handleReconnect = () => {
    reconnect();
  };

  // 소켓 테스트를 위한 상태
  const [testMessage, setTestMessage] = useState('{"type": "sendInitialLogs"}');
  const [testResponse, setTestResponse] = useState('');

  // 테스트 메시지 전송
  const sendTestMessage = () => {
    try {
      if (window.WebSocket && window._debugSocket) {
        if (window._debugSocket.readyState === WebSocket.OPEN) {
          window._debugSocket.send(testMessage);
          setTestResponse('메시지 전송 완료. 콘솔에서 응답을 확인하세요.');
        } else {
          setTestResponse(`소켓이 열려있지 않습니다. 현재 상태: ${window._debugSocket.readyState}`);
        }
      } else {
        setTestResponse('디버그 소켓이 없습니다. 페이지를 새로고침하세요.');
      }
    } catch (err) {
      setTestResponse(`오류 발생: ${err.message}`);
    }
  };

  // 디버그 소켓 설정
  useEffect(() => {
    if (isDev) {
      // 글로벌 변수에 소켓 참조 저장
      window._debugSocket = null;

      // 소켓 참조 업데이트 함수
      const updateDebugSocket = () => {
        if (socketRef && socketRef.current) {
          window._debugSocket = socketRef.current;
        }
      };

      // 1초마다 소켓 참조 확인
      const intervalId = setInterval(updateDebugSocket, 1000);

      return () => {
        clearInterval(intervalId);
        window._debugSocket = null;
      };
    }
  }, [socketRef]);

  // 테스트 모드 토글
  const handleTestModeToggle = (event) => {
    const enabled = event.target.checked;
    setTestModeEnabled(enabled);

    if (enabled) {
      enableTestMode();
    } else {
      disableTestMode();
    }
  };

  return (
    <MonitoringContainer>
      <Box sx={{ width: '100%' }}>
        {socketError && (
          <Box
            sx={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2">
              소켓 연결 오류: {socketError.message || socketError || '알 수 없는 오류'}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleReconnect}
              sx={{ ml: 2 }}
            >
              재연결
            </Button>
          </Box>
        )}

        {!isConnected && !socketError && (
          <Box
            sx={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2">
              소켓 {socketStatus === 'connecting' ? '연결 중...' : '연결 끊김'}
              {socketStatus === 'connecting' ? ' 잠시만 기다려주세요.' : ''}
            </Typography>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={handleReconnect}
              sx={{ ml: 2 }}
            >
              재연결
            </Button>
          </Box>
        )}

        {isConnected && logData?.length === 0 && (
          <Box
            sx={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              borderRadius: '4px',
            }}
          >
            <Typography variant="body2">소켓 연결됨. 데이터를 기다리는 중...</Typography>
          </Box>
        )}

        {/* 개발 모드에서만 표시되는 디버깅 패널 */}
        {isDev && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f1f5f9' }}>
              <Typography variant="subtitle2">소켓 디버깅 패널 (개발 모드)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  소켓 상태: {socketStatus} | 연결됨: {isConnected ? '예' : '아니오'} | 오류:{' '}
                  {socketError ? '있음' : '없음'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  로그 데이터: {logData?.length || 0}개 항목
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleReconnect}
                  sx={{ mr: 1 }}
                  disabled={testModeEnabled}
                >
                  소켓 재연결
                </Button>
                <Button variant="outlined" size="small" onClick={() => console.clear()}>
                  콘솔 지우기
                </Button>

                <FormControlLabel
                  control={
                    <Switch
                      checked={testModeEnabled}
                      onChange={handleTestModeToggle}
                      color="primary"
                    />
                  }
                  label="테스트 모드"
                  sx={{ ml: 2 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                테스트 메시지 전송
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                size="small"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button variant="contained" size="small" onClick={sendTestMessage} sx={{ mb: 1 }}>
                메시지 전송
              </Button>
              {testResponse && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {testResponse}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '16px' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="로그 분석" />
            <Tab label="실시간 로그 조회" />
            <Tab label="로그 필터링" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <LogAnalysis
            logs={logData || logs}
            source="realtime"
            realtimeStats={logStats}
            realtimeOptions={realtimeOptions}
            onRealtimeAnalysisAction={(action, params) => {
              if (action === 'changeOptions' && params) {
                setRealtimeOptions((prev) => ({ ...prev, ...params }));
              }
            }}
          />
        )}

        {activeTab === 1 && (
          <>
            <RealtimeLogStatus
              stats={logStats}
              lastUpdate={logStats.lastUpdate}
              onStatsChange={handleStatsChange}
            />
            <LogTable logs={logData || logs} />
          </>
        )}

        {activeTab === 2 && (
          <>
            <FilterWrapper>
              <LogLevelFilter
                selectedLevels={selectedLevels}
                onToggle={handleTagToggle}
                isLoading={filterLoading}
              />
            </FilterWrapper>
            <LogTable logs={filteredLogs} />
            <PaginationWrapper>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                disabled={filterLoading}
              />
            </PaginationWrapper>
          </>
        )}
      </Box>
    </MonitoringContainer>
  );
};

export default RealtimeMonitoring;
