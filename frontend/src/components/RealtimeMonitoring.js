import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import styled from 'styled-components';
import { logService } from '../services/api';
import { parseLogString } from '../utils/logParser';
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
          <div>타임스탬프</div>
          <div>레벨</div>
          <div>서비스</div>
          <div>메시지</div>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={`${log.timestamp}-${log.message}-${log.level}`}>
            <TableCell>{log.timestamp}</TableCell>
            <TableCell>
              <LogLevel level={log.level}>{log.level}</LogLevel>
            </TableCell>
            <TableCell>{log.service}</TableCell>
            <TableCell>{log.message}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  ),
  (prevProps, nextProps) => {
    // 로그 배열의 길이가 같고 마지막 로그가 같으면 리렌더링하지 않음
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
      const response = await logService.getErrorLogs(undefined, selectedLevels);
      const parsedLogs = response.data.data.logs.map(parseLogString);
      setFilteredLogs(parsedLogs);
    } catch (err) {
      console.error('로그 조회 실패:', err);
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
