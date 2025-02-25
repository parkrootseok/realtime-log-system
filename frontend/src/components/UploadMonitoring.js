import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
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
import UploadLogStatus from './UploadLogStatus';
import LogLevelFilter from './common/LogLevelFilter';
import LogAnalysis from './LogAnalysis';
import useUploadStore from '../stores/uploadStore';

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
        <div>발생시각</div>
        <div>레벨</div>
        <div>발생위치</div>
        <div>메시지</div>
      </TableHeaderRow>
    </TableHeader>
    {logs.length > 0 && (
      <TableBody>
        {logs.map((log, index) => {
          const timestamp =
            typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;

          return (
            <TableRow key={`${timestamp.getTime()}-${log.message}-${index}`}>
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
    )}
  </TableContainer>
);

const UploadMonitoring = ({ uploadedFile, onUploadStatusChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    processedFile,
    fileName,
    selectedLevels,
    filteredLogs,
    filterLoading,
    filterError,
    uploadSuccess,
    uploadError,
    stats,
    isUploading,
    initializeUpload,
    updateUploadSuccess,
    updateUploadError,
    updateFilterState,
    setSelectedLevels,
    setFilterLoading,
  } = useUploadStore();

  const [allLogs, setAllLogs] = useState([]);

  // 파일 업로드 처리를 위한 useEffect
  useEffect(() => {
    const handleFileUpload = async () => {
      // uploadedFile이 없거나 이미 처리된 파일이면 처리하지 않음
      if (!uploadedFile || (processedFile === uploadedFile && fileName)) {
        return;
      }

      // 이미 업로드 중이면 처리하지 않음
      if (isUploading) {
        return;
      }

      // 초기 상태 설정
      initializeUpload(uploadedFile);

      try {
        // 파일 업로드
        const uploadResponse = await logService.uploadLogs(uploadedFile);
        const newFileName = uploadResponse.data.data;

        // 로그 분석
        const analysisResponse = await logService.analyzeLogs(newFileName, 'ERROR');
        console.log(analysisResponse);

        const newStats = {
          totalCount: analysisResponse.totalLines,
          errorCount: analysisResponse.errorCount,
        };

        console.log('newStats', newStats);

        // 로그 조회
        const logsResponse = await logService.getErrorLogs(newFileName, selectedLevels);
        if (!logsResponse?.data?.data?.logs) {
          throw new Error('로그 조회 응답이 올바르지 않습니다.');
        }

        // 성공 상태 업데이트
        updateUploadSuccess({
          fileName: newFileName,
          stats: newStats,
          logs: logsResponse.data.data.logs,
        });

        onUploadStatusChange?.({ success: true, error: false });
      } catch (error) {
        console.error('파일 처리 실패:', error);
        updateUploadError(error.message || '파일 처리 중 오류가 발생했습니다.');
        onUploadStatusChange?.({ success: false, error: true });
      }
    };

    handleFileUpload();
  }, [uploadedFile]); // uploadedFile만 의존성으로 사용

  // 필터 변경 처리를 위한 useEffect
  useEffect(() => {
    const fetchFilteredLogs = async () => {
      if (!fileName || filterLoading) {
        return;
      }

      setFilterLoading(true);

      try {
        const response = await logService.getErrorLogs(fileName, selectedLevels);
        updateFilterState({ logs: response.data.data.logs });
      } catch (err) {
        console.error('로그 조회 실패:', err);
        updateFilterState({ error: '로그 조회 중 오류가 발생했습니다.' });
      }
    };

    fetchFilteredLogs();
  }, [fileName, selectedLevels]); // fileName과 selectedLevels만 의존성으로 사용

  // 모든 로그 데이터를 가져오는 useEffect 추가
  useEffect(() => {
    const fetchAllLogs = async () => {
      if (!fileName || !uploadSuccess) return;

      try {
        const response = await logService.getErrorLogs(fileName, ['INFO', 'WARN', 'ERROR']);
        if (response?.data?.data?.logs) {
          setAllLogs(response.data.data.logs);
        }
      } catch (err) {
        console.error('모든 로그 조회 실패:', err);
      }
    };

    fetchAllLogs();
  }, [fileName, uploadSuccess]);

  const handleTagToggle = (level) => {
    if (filterLoading || !fileName) return;

    const newLevels = selectedLevels.includes(level)
      ? selectedLevels.length > 1
        ? selectedLevels.filter((l) => l !== level)
        : selectedLevels
      : [...selectedLevels, level];

    setSelectedLevels(newLevels);
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '16px' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="로그 분석" />
          <Tab label="전체 로그 조회" />
        </Tabs>
      </Box>

      {activeTab === 0 && <LogAnalysis logs={allLogs} />}

      {activeTab === 1 && (
        <>
          <StatsAndFilterWrapper>
            <UploadLogStatus
              totalCount={stats?.totalCount || 0}
              errorCount={stats?.errorCount || 0}
            />
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
        </>
      )}
    </MonitoringContainer>
  );
};

export default UploadMonitoring;
