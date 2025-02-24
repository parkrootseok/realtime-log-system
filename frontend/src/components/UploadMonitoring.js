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
import LogLevelFilter from './common/LogLevelFilter';

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
  margin-bottom: 16px;
  gap: 16px;
`;

const FilterWrapper = styled.div``;

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

// 컴포넌트 외부에 상태 저장소 선언
export const fileStateStore = {
  processedFile: null,
  logs: [],
  stats: { totalCount: 0, errorCount: 0 },
  fileName: null,
  selectedLevels: ['ERROR', 'WARN', 'INFO'],
};

const UploadMonitoring = ({ uploadedFile, onUploadStatusChange }) => {
  const [selectedLevels, setSelectedLevels] = useState(fileStateStore.selectedLevels);
  const [filteredLogs, setFilteredLogs] = useState(fileStateStore.logs);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [logStats, setLogStats] = useState(fileStateStore.stats);
  const [isUploading, setIsUploading] = useState(false);

  // 이전 uploadedFile을 추적하기 위한 ref 추가
  const previousFileRef = useRef(null);

  // 컴포넌트 마운트 시 저장된 상태 복원
  useEffect(() => {
    // uploadedFile이 null이면 모든 상태 초기화
    if (!uploadedFile) {
      setFilteredLogs([]);
      setLogStats({ totalCount: 0, errorCount: 0 });
      setSelectedLevels(['ERROR', 'WARN', 'INFO']);
      setUploadSuccess(false);
      setUploadError(null);
      setFilterError(null);
      return;
    }

    // 이미 처리된 파일이고 fileName이 있는 경우 재요청하지 않음
    if (fileStateStore.processedFile === uploadedFile && fileStateStore.fileName) {
      setFilteredLogs(fileStateStore.logs);
      setLogStats(fileStateStore.stats);
      setSelectedLevels(fileStateStore.selectedLevels);
      setUploadSuccess(true);
      onUploadStatusChange?.({ success: true, error: false });
      return;
    }

    const uploadFile = async () => {
      if (isUploading) {
        return;
      }

      // 새로운 파일이거나 fileName이 없는 경우에만 상태 초기화
      if (uploadedFile !== fileStateStore.processedFile || !fileStateStore.fileName) {
        setFilteredLogs([]);
        setLogStats({ totalCount: 0, errorCount: 0 });
        setSelectedLevels(['ERROR', 'WARN', 'INFO']);
        setUploadSuccess(false);
        setUploadError(null);
        setFilterError(null);

        fileStateStore.processedFile = null;
        fileStateStore.logs = [];
        fileStateStore.stats = { totalCount: 0, errorCount: 0 };
        fileStateStore.fileName = null;
        fileStateStore.selectedLevels = ['ERROR', 'WARN', 'INFO'];
      }

      fileStateStore.processedFile = uploadedFile;
      setIsUploading(true);

      try {
        console.log('업로드 요청 시작');
        const uploadResponse = await logService.uploadLogs(uploadedFile);
        console.log('uploadResponse:', uploadResponse);

        const newFileName = uploadResponse.data.data;
        fileStateStore.fileName = newFileName;

        try {
          const analysisResponse = await logService.analyzeLogs(newFileName);
          console.log('analysisResponse:', analysisResponse);

          if (!analysisResponse || typeof analysisResponse.totalLines === 'undefined') {
            throw new Error('로그 분석 응답이 올바르지 않습니다.');
          }

          const newStats = {
            totalCount: analysisResponse.totalLines,
            errorCount: analysisResponse.errorCount,
          };
          fileStateStore.stats = newStats;
          setLogStats(newStats);
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
          fileStateStore.logs = parsedLogs;
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
  }, [uploadedFile, isUploading, onUploadStatusChange]);

  const handleTagToggle = async (level) => {
    // 파일이 없거나 로딩 중이면 필터 동작 막기
    if (filterLoading || !fileStateStore.fileName) return;

    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.length > 1
        ? selectedLevels.filter((l) => l !== level)
        : selectedLevels
      : [...selectedLevels, level];

    setSelectedLevels(newLevels);
    fileStateStore.selectedLevels = newLevels;

    // 필터 레벨이 변경된 후 즉시 로그를 가져옵니다
    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(fileStateStore.fileName, newLevels);
      const parsedLogs = response.data.data.logs.map(parseLogString);
      fileStateStore.logs = parsedLogs;
      setFilteredLogs(parsedLogs);
    } catch (err) {
      console.error('로그 조회 실패:', err);
      setFilterError('로그 조회 중 오류가 발생했습니다.');
      setFilteredLogs([]);
    } finally {
      setFilterLoading(false);
    }
  };

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
          <LogLevelFilter
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
