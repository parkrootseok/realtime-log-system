import React, { useState, useEffect } from 'react';
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
        {logs.map((log) => (
          <TableRow key={`${log.timestamp}-${log.message}`}>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
            <TableCell>
              <LogLevel level={log.level}>{log.level}</LogLevel>
            </TableCell>
            <TableCell>{log.serviceName}</TableCell>
            <TableCell>{log.message}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.logs.length === nextProps.logs.length &&
      prevProps.logs[prevProps.logs.length - 1]?.timestamp ===
        nextProps.logs[nextProps.logs.length - 1]?.timestamp
    );
  }
);

LogTable.displayName = 'LogTable';

const RealtimeMonitoring = ({ logs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  const fetchFilteredLogs = async () => {
    if (activeTab !== 1) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      console.log('로그 필터링 요청 파라미터:', {
        levels: selectedLevels,
      });

      const response = await logService.getErrorLogs(undefined, selectedLevels);
      console.log('로그 필터링 응답:', response);

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

    setSelectedLevels((prev) => {
      const newLevels =
        prev.includes(level) && prev.length === 1
          ? prev
          : prev.includes(level)
            ? prev.filter((l) => l !== level)
            : [...prev, level];
      return newLevels;
    });
  };

  useEffect(() => {
    if (activeTab === 1) {
      console.log('필터링 탭 활성화, 선택된 레벨:', selectedLevels);
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
