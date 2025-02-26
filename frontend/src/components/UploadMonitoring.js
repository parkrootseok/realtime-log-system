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

const LogTable = React.memo(({ logs }) => (
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
        {logs.map((log, index) => (
          <TableRow key={`${new Date(log.timestamp).getTime()}-${log.message}-${index}`}>
            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
            <TableCell>
              <LogLevel $level={log.level}>{log.level}</LogLevel>
            </TableCell>
            <TableCell>{log.serviceName}</TableCell>
            <TableCell>{log.message}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    )}
  </TableContainer>
));

LogTable.displayName = 'LogTable';

const UploadMonitoring = ({ uploadedFile, onUploadStatusChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const {
    processedFile,
    fileName,
    selectedLevels,
    filteredLogs,
    filterLoading,
    uploadError,
    stats,
    isUploading,
    initializeUpload,
    updateUploadSuccess,
    updateUploadError,
    updateFilterState,
    setSelectedLevels,
    setFilterLoading,
    setLogs,
  } = useUploadStore();

  // store에서 전체 로그 가져오기
  const storeLogs = useUploadStore((state) => state.logs);

  // 파일 업로드 처리
  useEffect(() => {
    const handleFileUpload = async () => {
      if (!uploadedFile || (processedFile === uploadedFile && fileName) || isUploading) {
        return;
      }

      initializeUpload(uploadedFile);

      try {
        // 파일 업로드
        const uploadResponse = await logService.uploadLogs(uploadedFile);
        const newFileName = uploadResponse.data.data.fileName;

        // 로그 분석
        const analysisResponse = await logService.analyzeLogs(newFileName, 'ERROR,WARN,INFO');
        const newStats = {
          totalCount: analysisResponse.totalLines,
          infoCount: analysisResponse.infoCount,
          errorCount: analysisResponse.errorCount,
          warnCount: analysisResponse.warnCount,
        };

        // 모든 로그 가져오기
        const allLogsResponse = await logService.getErrorLogs(newFileName, [
          'INFO',
          'WARN',
          'ERROR',
        ]);
        if (!allLogsResponse?.data?.data?.logs) {
          throw new Error('로그 조회 응답이 올바르지 않습니다.');
        }

        const allLogsData = allLogsResponse.data.data.logs;
        setLogs(allLogsData);

        const filteredLogsData = allLogsData.filter((log) => selectedLevels.includes(log.level));

        updateUploadSuccess({
          fileName: newFileName,
          stats: newStats,
          logs: filteredLogsData,
        });

        onUploadStatusChange?.({ success: true, error: false });
        setUploadCompleted(true);
      } catch (error) {
        console.error('파일 처리 실패:', error);
        updateUploadError(error.message || '파일 처리 중 오류가 발생했습니다.');
        onUploadStatusChange?.({ success: false, error: true });
      }
    };

    handleFileUpload();
  }, [uploadedFile, processedFile, fileName, isUploading]);

  useEffect(() => {
    if (!uploadCompleted || !fileName || !storeLogs) {
      return;
    }

    setFilterLoading(true);
    try {
      const filteredLogsData = storeLogs.filter((log) => selectedLevels.includes(log.level));
      updateFilterState({ logs: filteredLogsData });
    } catch (err) {
      console.error('로그 필터링 실패:', err);
      updateFilterState({ error: '로그 필터링 중 오류가 발생했습니다.' });
    } finally {
      setFilterLoading(false);
    }
  }, [uploadCompleted, fileName, selectedLevels, storeLogs]);

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

      {activeTab === 0 && <LogAnalysis logs={storeLogs} source="upload" />}

      {activeTab === 1 && (
        <>
          <StatsAndFilterWrapper>
            <UploadLogStatus
              totalCount={stats?.totalCount || 0}
              errorCount={stats?.errorCount || 0}
            />
            <LogLevelFilter
              selectedLevels={selectedLevels}
              onToggle={handleTagToggle}
              isLoading={filterLoading}
            />
          </StatsAndFilterWrapper>

          <LogTable logs={filteredLogs} />
        </>
      )}
    </MonitoringContainer>
  );
};

export default UploadMonitoring;
