import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';
import StatusItem from './common/StatusItem';

const StatusWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const UpdateTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UpdateTime = styled.span`
  color: #64748b;
  font-size: 13px;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    color: #3b82f6;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const RealtimeLogStatus = ({ stats, lastUpdate, onStatsChange }) => {
  const [internalStats, setInternalStats] = useState({
    totalLogsCount: 0,
    errorLogsCount: 0,
    infoLogsCount: 0,
    warnLogsCount: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [internalLastUpdate, setInternalLastUpdate] = useState(new Date());
  const [timeString, setTimeString] = useState('방금 전');

  // 실제로 사용할 stats와 lastUpdate 결정
  const effectiveStats = stats || internalStats;
  const effectiveLastUpdate = lastUpdate || internalLastUpdate;

  const getRelativeTimeString = (date) => {
    const diff = new Date() - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '방금 전';
    if (minutes === 1) return '1분 전';
    return `${minutes}분 전`;
  };

  const fetchLogStats = async () => {
    try {
      const statsData = await logService.analyzeLogs('', 'ERROR,WARN,INFO');
      const newStats = {
        totalLogsCount: statsData.totalLines,
        infoLogsCount: statsData.infoCount,
        warnLogsCount: statsData.warnCount,
        errorLogsCount: statsData.errorCount,
      };

      setInternalStats(newStats);
      setInternalLastUpdate(new Date());

      if (onStatsChange) {
        onStatsChange(newStats);
      }
    } catch (err) {
      console.error('로그 통계 조회 실패:', err);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchLogStats();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!stats) {
      fetchLogStats();
      const statsInterval = setInterval(fetchLogStats, 300000);
      return () => clearInterval(statsInterval);
    }
  }, [stats]);

  useEffect(() => {
    const updateTimeString = () => {
      setTimeString(getRelativeTimeString(effectiveLastUpdate));
    };

    updateTimeString();
    const timeInterval = setInterval(updateTimeString, 60000); // 1분마다 갱신

    return () => clearInterval(timeInterval);
  }, [effectiveLastUpdate]);

  return (
    <StatusWrapper>
      <StatusItem label="전체 로그" value={effectiveStats.totalLogsCount.toLocaleString()} />
      <StatusItem
        label="에러"
        value={effectiveStats.errorLogsCount.toLocaleString()}
        type="error"
      />
      <UpdateTimeWrapper>
        <UpdateTime>마지막 갱신: {timeString}</UpdateTime>
        <RefreshButton onClick={handleRefresh} disabled={refreshing}>
          <RefreshIcon />
        </RefreshButton>
      </UpdateTimeWrapper>
    </StatusWrapper>
  );
};

// 기본 props 설정
RealtimeLogStatus.defaultProps = {
  stats: null,
  lastUpdate: null,
  onStatsChange: null,
};

export default RealtimeLogStatus;
