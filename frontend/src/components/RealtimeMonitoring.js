import React, { useEffect } from 'react';
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
import { LogLevel, FilterTag } from './common/LogLevel';
import RealtimeLogStatus from './RealtimeLogStatus';
import LogLevelFilter from './common/LogLevelFilter';
import useRealtimeStore from '../stores/realtimeStore';

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

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const TabPanel = styled.div`
  padding: 24px 0;
`;

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

  const fetchFilteredLogs = async () => {
    if (activeTab !== 1) return;

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
    if (activeTab === 1) {
      fetchFilteredLogs();
    }
  }, [activeTab, selectedLevels]);

  return (
    <MonitoringContainer>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="실시간 로그" />
            <Tab label="로그 필터링" />
          </Tabs>
        </Box>

        <TabPanel role="tabpanel" hidden={activeTab !== 0}>
          {activeTab === 0 && (
            <>
              <RealtimeLogStatus />
              <LogTable logs={logs} />
            </>
          )}
        </TabPanel>

        <TabPanel role="tabpanel" hidden={activeTab !== 1}>
          {activeTab === 1 && (
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
        </TabPanel>
      </Box>
    </MonitoringContainer>
  );
};

export default RealtimeMonitoring;
