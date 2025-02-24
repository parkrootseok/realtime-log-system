import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import styled from 'styled-components';
import { logService } from '../services/api';
import { parseLogString } from '../utils/logParser';
import {
  TableContainer,
  TableHeader,
  TableHeaderTop,
  TableHeaderRow,
  TableRow,
  TableCell,
  TableBody,
} from './common/Table';
import { LogLevel, FilterTag } from './common/LogLevel';
import RealtimeLogStatus from './RealtimeLogStatus';

const MonitoringContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  height: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const TabPanel = styled.div`
  padding: 24px 0;
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 40px;
  margin-bottom: 24px;
`;

const StatusWrapper = styled(FilterWrapper)`
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const RealtimeMonitoring = ({ logs }) => {
  const [value, setValue] = useState(0);
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTagToggle = (level) => {
    if (filterLoading) return;
    setSelectedLevels((prev) => {
      if (prev.includes(level)) {
        return prev.length > 1 ? prev.filter((l) => l !== level) : prev;
      }
      return [...prev, level];
    });
  };

  const fetchFilteredLogs = async () => {
    if (value !== 1) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(selectedLevels);

      // 문자열 로그를 파싱하여 객체로 변환
      const parsedLogs = response.data.data.logs
        .map((logStr) => {
          const match = logStr.match(
            /^(\S+\s+\S+)\s+(\w+)\s+\[([^\]]+)\]\s*-\s*\[([^\]]+)\]\s*-\s*(.*)$/
          );
          if (match) {
            return {
              timestamp: match[1],
              level: match[2],
              service: match[4], // [Service] 부분 추출
              message: match[5].trim(),
            };
          }
          return null;
        })
        .filter((log) => log !== null);

      setFilteredLogs(parsedLogs);
    } catch (err) {
      console.error('API 에러:', err);
      setFilterError('로그 조회 중 오류가 발생했습니다.');
      setFilteredLogs([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchFilteredLogs();
  };

  useEffect(() => {
    if (value === 1 && selectedLevels.length > 0) {
      fetchFilteredLogs();
    }
  }, [selectedLevels, value]);

  const renderLogTable = (logsData) => (
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
        {logsData.map((log, index) => (
          <TableRow key={index}>
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
  );

  return (
    <MonitoringContainer>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="실시간 로그" />
            <Tab label="로그 필터링" />
          </Tabs>
        </Box>

        <TabPanel role="tabpanel" hidden={value !== 0}>
          {value === 0 && (
            <>
              <RealtimeLogStatus onRefresh={handleRefresh} />
              {renderLogTable(logs)}
            </>
          )}
        </TabPanel>

        <TabPanel role="tabpanel" hidden={value !== 1}>
          {value === 1 && (
            <>
              {filterError && (
                <div style={{ color: '#dc2626', marginBottom: '16px' }}>{filterError}</div>
              )}
              <FilterWrapper>
                <FilterContainer>
                  {['ERROR', 'WARN', 'INFO'].map((level) => (
                    <FilterTag
                      key={level}
                      $selected={selectedLevels.includes(level)}
                      onClick={() => handleTagToggle(level)}
                    >
                      <span
                        style={{
                          color:
                            level === 'ERROR'
                              ? '#dc2626'
                              : level === 'WARN'
                                ? '#f59e0b'
                                : '#3b82f6',
                        }}
                      >
                        ●
                      </span>
                      {level}
                    </FilterTag>
                  ))}
                </FilterContainer>
              </FilterWrapper>
              {renderLogTable(filteredLogs)}
            </>
          )}
        </TabPanel>
      </Box>
    </MonitoringContainer>
  );
};

export default RealtimeMonitoring;
