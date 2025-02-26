import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Pagination } from '@mui/material';
import styled from 'styled-components';
import { logService } from '../../services/api';
import {
  TableContainer,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableCell,
  TableBody,
} from '../common/table/Table';
import { LogLevel } from '../common/loglevel/LogLevel';
import RealtimeLogStatus from './RealtimeLogStatus';
import LogLevelFilter from '../common/loglevel/LogLevelFilter';
import useRealtimeStore from '../../stores/realtimeStore';
import LogAnalysis from '../LogAnalysis';

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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const LogTable = React.memo(
  ({ logs }) => {
    const emptyRows = Array(20 - logs.length).fill(null);

    return (
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
          {logs.map((log, index) => {
            const timestamp =
              typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;

            return (
              <TableRow key={`${timestamp.getTime()}-${log.serviceName}-${log.message}-${index}`}>
                <TableCell>{timestamp.toLocaleString()}</TableCell>
                <TableCell>
                  <LogLevel $level={log.level}>{log.level}</LogLevel>
                </TableCell>
                <TableCell>{log.serviceName}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            );
          })}
          {emptyRows.map((_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    );
  },
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
    logStats,
    updateLogStats,
  } = useRealtimeStore();

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
      console.error('실시간 로그 통계 조회 실패:', err);
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
            <LogTable logs={logs} />
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
