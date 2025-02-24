import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
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
import { parseLogString } from '../utils/logParser';

const MonitoringContainer = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  height: 100%;
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

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ErrorBox = styled(Box)`
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fef2f2;
  border-radius: 8px;
  color: #dc2626;
`;

const LogTable = ({ logs }) => (
  <TableContainer>
    <TableHeader>
      <TableHeaderRow>
        <div>타임스탬프</div>
        <div>레벨</div>
        <div>서비스</div>
        <div>메시지</div>
      </TableHeaderRow>
    </TableHeader>
    {logs.length > 0 && (
      <TableBody>
        {logs.map((log, index) => (
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
    )}
  </TableContainer>
);

const LogFilter = ({ selectedLevels, onToggle, isLoading }) => (
  <FilterContainer>
    {['ERROR', 'WARN', 'INFO'].map((level) => (
      <FilterTag
        key={level}
        $selected={selectedLevels.includes(level)}
        onClick={() => !isLoading && onToggle(level)}
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
);

const UploadMonitoring = ({ uploadedFile, onUploadStatusChange }) => {
  const [selectedLevels, setSelectedLevels] = useState(['ERROR', 'WARN', 'INFO']);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [logStats, setLogStats] = useState({ totalCount: 0, errorCount: 0 });
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const previousFileRef = useRef(null);

  const fetchFilteredLogs = async () => {
    if (!uploadedFileName) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(uploadedFileName, selectedLevels);
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
      const newLevels = prev.includes(level)
        ? prev.length > 1
          ? prev.filter((l) => l !== level)
          : prev
        : [...prev, level];

      setTimeout(() => fetchFilteredLogs(), 0);
      return newLevels;
    });
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (!uploadedFile || isUploading || uploadedFile === previousFileRef.current) return;

      previousFileRef.current = uploadedFile;
      setIsUploading(true);

      try {
        console.log('업로드 요청 시작');
        const uploadResponse = await logService.uploadLogs(uploadedFile);
        console.log('uploadResponse:', uploadResponse);

        const newFileName = uploadResponse.data.data;
        setUploadedFileName(newFileName);

        console.log('파일 분석 시작:', newFileName);

        try {
          const analysisResponse = await logService.analyzeLogs(newFileName);
          console.log('analysisResponse:', analysisResponse);

          // 응답 구조 변경
          if (!analysisResponse || typeof analysisResponse.totalLines === 'undefined') {
            throw new Error('로그 분석 응답이 올바르지 않습니다.');
          }

          setLogStats({
            totalCount: analysisResponse.totalLines,
            errorCount: analysisResponse.errorCount,
          });
        } catch (analysisError) {
          console.error('분석 요청 실패:', analysisError);
          throw new Error('로그 분석 중 오류가 발생했습니다.');
        }

        try {
          const logsResponse = await logService.getErrorLogs(newFileName, selectedLevels);
          console.log('logsResponse:', logsResponse);

          if (!logsResponse?.data?.data?.logs) {
            throw new Error('로그 조회 응답이 올바르지 않습니다.');
          }

          const parsedLogs = logsResponse.data.data.logs.map(parseLogString);
          setFilteredLogs(parsedLogs);
        } catch (logsError) {
          console.error('로그 조회 실패:', logsError);
          throw new Error('로그 조회 중 오류가 발생했습니다.');
        }

        setUploadSuccess(true);
        onUploadStatusChange?.({ success: true, error: false });
      } catch (error) {
        console.log('업로드 요청 실패:', error);
        setUploadError(error.message || '파일 업로드 중 오류가 발생했습니다.');
        setFilteredLogs([]);
        onUploadStatusChange?.({ success: false, error: true });
      } finally {
        setIsUploading(false);
      }
    };

    uploadFile();
  }, [uploadedFile, onUploadStatusChange]);

  return (
    <MonitoringContainer>
      {uploadError && (
        <ErrorBox>
          <Typography variant="body2" color="error">
            {uploadError}
          </Typography>
        </ErrorBox>
      )}

      <StatsAndFilterWrapper>
        <UploadLogStatus totalCount={logStats.totalCount} errorCount={logStats.errorCount} />
        <FilterWrapper>
          <LogFilter
            selectedLevels={selectedLevels}
            onToggle={handleTagToggle}
            isLoading={filterLoading}
          />
        </FilterWrapper>
      </StatsAndFilterWrapper>

      {filterError && <ErrorBox>{filterError}</ErrorBox>}
      <LogTable logs={filteredLogs} />
    </MonitoringContainer>
  );
};

export default UploadMonitoring;
