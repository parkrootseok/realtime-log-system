import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Box, Tabs, Tab, Pagination } from '@mui/material';
import { logService } from '../../../services/api';
import useRealtimeStore from '../../../stores/realtimeStore';
import LogTable from '../common/LogTable';
import RealtimeLogStatus from './RealtimeLogStatus';
import LogLevelFilter from './LogLevelFilter';
import LogAnalysis from '../analysis/LogAnalysis';

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

const RealtimeMonitoring = ({ logs = [] }) => {
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

  const handleStatsChange = useCallback(
    (newStats) => {
      updateLogStats(newStats);
    },
    [updateLogStats]
  );

  const fetchRealtimeStats = useCallback(async () => {
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
  }, [updateLogStats]);

  const fetchFilteredLogs = useCallback(async () => {
    if (activeTab !== 2) return;

    setFilterLoading(true);
    setFilterError(null);

    try {
      const response = await logService.getErrorLogs(undefined, selectedLevels, page, pageSize);

      if (!response?.data?.data?.logs) {
        throw new Error('로그 조회 응답이 올바르지 않습니다.');
      }

      setFilteredLogs(response.data.data.logs);
      setTotalPages(Math.ceil(response.data.data.totalElements / pageSize));
    } catch (err) {
      console.error('로그 조회 실패:', err);
      setFilterError('로그 조회 중 오류가 발생했습니다.');
      setFilteredLogs([]);
    } finally {
      setFilterLoading(false);
    }
  }, [
    activeTab,
    selectedLevels,
    page,
    pageSize,
    setFilterLoading,
    setFilterError,
    setFilteredLogs,
  ]);

  const handleTagToggle = useCallback(
    (level) => {
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
    },
    [filterLoading, selectedLevels, setSelectedLevels]
  );

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage - 1);
  }, []);

  useEffect(() => {
    fetchRealtimeStats();
    const statsInterval = setInterval(fetchRealtimeStats, 60000); // 1분마다 갱신
    return () => clearInterval(statsInterval);
  }, [fetchRealtimeStats]);

  useEffect(() => {
    if (activeTab === 2) {
      fetchFilteredLogs();
    }
  }, [activeTab, selectedLevels, page, fetchFilteredLogs]);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <LogAnalysis logs={logs} source="realtime" realtimeStats={logStats} />;
      case 1:
        return (
          <>
            <RealtimeLogStatus
              stats={logStats}
              lastUpdate={logStats.lastUpdate}
              onStatsChange={handleStatsChange}
            />
            <LogTable logs={logs} />
          </>
        );
      case 2:
        return (
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
            {totalPages > 1 && (
              <PaginationWrapper>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  disabled={filterLoading}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </PaginationWrapper>
            )}
          </>
        );
      default:
        return null;
    }
  };

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
        {renderContent()}
      </Box>
    </MonitoringContainer>
  );
};

export default React.memo(RealtimeMonitoring);
