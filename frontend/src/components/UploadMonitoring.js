import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
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
import UploadLogStatus from './UploadLogStatus';

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

const StatsAndFilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const parseLogLine = (logLine) => {
  // 예: "2025-02-24 15:55:58 INFO  [c.h.b.d.l.s.LogGeneratorService] - [InventoryService] - User login successful: user537"
  const match = logLine.match(/^(\S+ \S+) (\w+)\s+\[([^\]]+)\] - \[([^\]]+)\] - (.+)$/);
  if (match) {
    return {
      timestamp: match[1],
      level: match[2],
      logger: match[3],
      service: match[4],
      message: match[5],
    };
  }
  return {
    timestamp: '',
    level: 'UNKNOWN',
    logger: '',
    service: '',
    message: logLine,
  };
};

const UploadMonitoring = ({ uploadedFile, onUploadStatusChange }) => {
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [logStats, setLogStats] = useState({
    totalCount: 0,
    errorCount: 0,
  });
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleTagToggle = (level) => {
    if (filterLoading) return;
    setSelectedLevels((prev) => {
      const newLevels = prev.includes(level)
        ? prev.length > 1
          ? prev.filter((l) => l !== level)
          : prev
        : [...prev, level];

      setTimeout(() => fetchFilteredLogs(), 0);
      return newLevels;
    });
  };

  const fetchFilteredLogs = async () => {
    if (!uploadedFileName) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(uploadedFileName, selectedLevels);
      const rawLogs = response.data.data.logs;
      const parsedLogs = rawLogs.map(parseLogLine);
      setFilteredLogs(parsedLogs);
    } catch (err) {
      console.error('API 에러:', err);
      setFilterError('로그 조회 중 오류가 발생했습니다.');
      setFilteredLogs([]);
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (!uploadedFile) return;

      try {
        console.log('파일 업로드 시작:', uploadedFile.name, uploadedFile.size);
        const uploadResponse = await logService.uploadLogs(uploadedFile);
        console.log('업로드 응답:', uploadResponse.data);

        const newFileName = uploadResponse.data.data;
        if (!newFileName) {
          throw new Error('파일 업로드에 실패했습니다.');
        }

        setUploadedFileName(newFileName);

        const [analysisResponse, logsResponse] = await Promise.all([
          logService.analyzeLogs(newFileName),
          logService.getErrorLogs(newFileName, selectedLevels),
        ]);

        console.log('로그 분석 결과:', analysisResponse.data);

        setLogStats({
          totalCount: analysisResponse.data.data.totalLogsCount,
          errorCount: analysisResponse.data.data.errorLogsCount,
        });

        const rawLogs = logsResponse.data.data.logs;
        const parsedLogs = rawLogs.map(parseLogLine);
        setFilteredLogs(parsedLogs);

        setUploadSuccess(true);
        onUploadStatusChange?.({ success: true, error: false });
      } catch (err) {
        console.error('파일 업로드 실패:', err);
        const errorMessage = err.message || '파일 업로드 중 오류가 발생했습니다.';
        setUploadError(errorMessage);
        setFilteredLogs([]);
        onUploadStatusChange?.({ success: false, error: true });
      }
    };

    uploadFile();
  }, [uploadedFile, selectedLevels, onUploadStatusChange]);

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
      {logsData.length > 0 ? (
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
      ) : null}
    </TableContainer>
  );

  return (
    <MonitoringContainer>
      {uploadError && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#fef2f2', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            {uploadError}
          </Typography>
        </Box>
      )}

      <StatsAndFilterWrapper>
        <UploadLogStatus totalCount={logStats.totalCount} errorCount={logStats.errorCount} />
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
                    color: level === 'ERROR' ? '#dc2626' : level === 'WARN' ? '#f59e0b' : '#3b82f6',
                  }}
                >
                  ●
                </span>
                {level}
              </FilterTag>
            ))}
          </FilterContainer>
        </FilterWrapper>
      </StatsAndFilterWrapper>

      {filterError && <div style={{ color: '#dc2626', marginBottom: '16px' }}>{filterError}</div>}

      {renderLogTable(filteredLogs)}
    </MonitoringContainer>
  );
};

export default UploadMonitoring;
