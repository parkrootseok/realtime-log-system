import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import styled from 'styled-components';
import { logService } from '../services/api';
import {
  TableContainer,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableCell,
  TableBody,
} from './common/Table';
import { LogLevel } from './common/LogLevel';
import RealtimeLogStatus from './RealtimeLogStatus';
import LogLevelFilter from './common/LogLevelFilter';
import useRealtimeStore from '../stores/realtimeStore';
import LogAnalysis from './LogAnalysis';

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

const TabPanel = styled.div``;

const ErrorBox = styled.div`
  color: #dc2626;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const LogTable = React.memo(
  ({ logs }) => (
    <TableContainer>
      <TableHeader>
        <TableHeaderRow>
          <div>발생시각</div>
          <div>레벨</div>
          <div>발생위치</div>
          <div>메시지</div>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => {
          const timestamp =
            typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;

          return (
            <TableRow key={`${timestamp.getTime()}-${log.serviceName}-${log.message}`}>
              <TableCell>{timestamp.toLocaleString()}</TableCell>
              <TableCell>
                <LogLevel $level={log.level}>{log.level}</LogLevel>
              </TableCell>
              <TableCell>{log.serviceName}</TableCell>
              <TableCell>{log.message}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  ),
  (prevProps, nextProps) => {
    const getLastTimestamp = (logs) => {
      if (!logs || logs.length === 0) return null;
      const lastLog = logs[logs.length - 1];
      return typeof lastLog.timestamp === 'string'
        ? new Date(lastLog.timestamp).getTime()
        : lastLog.timestamp.getTime();
    };

    return (
      prevProps.logs.length === nextProps.logs.length &&
      getLastTimestamp(prevProps.logs) === getLastTimestamp(nextProps.logs)
    );
  }
);

LogTable.displayName = 'LogTable';

const RealtimeMonitoring = ({ logs }) => {
  const {
    activeTab,
    selectedLevels,
    filteredLogs,
    filterLoading,
    filterError,
    setActiveTab,
    setSelectedLevels,
    setFilteredLogs,
    setFilterLoading,
    setFilterError,
  } = useRealtimeStore();

  // 공유할 실시간 로그 통계 상태 - 모든 탭에서 사용할 통합된 상태
  const [realtimeStats, setRealtimeStats] = useState({
    totalLogsCount: 0,
    errorCount: 0,
    infoCount: 0,
    warnCount: 0,
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // 실시간 로그 분석 옵션
  const [realtimeOptions, setRealtimeOptions] = useState({
    refreshInterval: 60000, // 기본 1분
    chartType: 'line',
    timeRange: 'day',
  });

  const handleStatsChange = (newStats) => {
    setRealtimeStats({
      totalLogsCount: newStats.totalLogsCount || 0,
      errorCount: newStats.errorLogsCount || 0,
      infoCount: newStats.infoLogsCount || 0,
      warnCount: newStats.warnLogsCount || 0,
    });
    setLastUpdate(new Date());
  };

  // 실시간 로그 통계 가져오기
  const fetchRealtimeStats = async () => {
    try {
      const stats = await logService.analyzeLogs('', 'ERROR,WARN,INFO');
      setRealtimeStats({
        totalLogsCount: stats.totalLines || 0,
        errorCount: stats.errorCount || 0,
        infoCount: stats.infoCount || 0,
        warnCount: stats.warnCount || 0,
      });
      setLastUpdate(new Date());
    } catch (err) {
      console.error('실시간 로그 통계 조회 실패:', err);
    }
  };

  // 컴포넌트가 마운트될 때와 주기적으로 데이터 가져오기
  useEffect(() => {
    // 초기 데이터 로드
    fetchRealtimeStats();

    // 주기적으로 통계 업데이트
    const intervalId = setInterval(fetchRealtimeStats, realtimeOptions.refreshInterval);
    return () => clearInterval(intervalId);
  }, [realtimeOptions.refreshInterval]);

  const fetchFilteredLogs = async () => {
    if (activeTab !== 2) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(undefined, selectedLevels);

      if (!response?.data?.data?.logs) {
        console.error('응답 데이터 구조 확인:', response);
        throw new Error('로그 조회 응답이 올바르지 않습니다.');
      }

      setFilteredLogs(response.data.data.logs);
    } catch (err) {
      console.error('로그 조회 실패:', err);
      console.error('에러 상세:', {
        message: err.message,
        response: err.response,
      });
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

  useEffect(() => {
    if (activeTab === 2) {
      fetchFilteredLogs();
    }
  }, [activeTab, selectedLevels]);

  return (
    <MonitoringContainer>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '16px' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="로그 분석" />
            <Tab label="실시간 로그 조회" />
            <Tab label="로그 필터링" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <LogAnalysis
            logs={logs}
            source="realtime"
            realtimeStats={{
              totalLogsCount: realtimeStats.totalLogsCount || 0,
              errorCount: realtimeStats.errorCount || 0,
              infoCount: realtimeStats.infoCount || 0,
              warnCount: realtimeStats.warnCount || 0,
            }}
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
              stats={{
                totalLogsCount: realtimeStats.totalLogsCount || 0,
                errorLogsCount: realtimeStats.errorCount || 0,
                infoLogsCount: realtimeStats.infoCount || 0,
                warnLogsCount: realtimeStats.warnCount || 0,
              }}
              lastUpdate={lastUpdate}
              onStatsChange={handleStatsChange}
            />
            <LogTable logs={logs} />
          </>
        )}

        {activeTab === 2 && (
          <>
            {filterError && <ErrorBox>{filterError}</ErrorBox>}
            <FilterWrapper>
              <LogLevelFilter
                selectedLevels={selectedLevels}
                onToggle={handleTagToggle}
                isLoading={filterLoading}
              />
            </FilterWrapper>
            <LogTable logs={filteredLogs} />
          </>
        )}
      </Box>
    </MonitoringContainer>
  );
};

export default RealtimeMonitoring;
