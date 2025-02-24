import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';

const StatusWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  margin-bottom: 24px;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) => (props.$type === 'error' ? '#FEF2F2' : '#F0F9FF')};
  border-radius: 8px;
`;

const StatusLabel = styled.span`
  color: #475569;
  font-size: 14px;
  font-weight: 500;
`;

const StatusValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.$type === 'error' ? '#DC2626' : '#3B82F6')};
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

const RealtimeLogStatus = () => {
  const [stats, setStats] = useState({ totalLogsCount: 0, errorLogsCount: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [timeString, setTimeString] = useState('방금 전');

  const getRelativeTimeString = () => {
    const diff = new Date() - lastUpdate;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return '방금 전';
    if (minutes === 1) return '1분 전';
    return `${minutes}분 전`;
  };

  useEffect(() => {
    setTimeString(getRelativeTimeString());
    const timer = setInterval(() => {
      setTimeString(getRelativeTimeString());
    }, 60000);

    return () => clearInterval(timer);
  }, [lastUpdate]);

  const fetchLogStats = async () => {
    try {
      const response = await logService.analyzeLogs();
      setStats(response.data.data);
      setLastUpdate(new Date());
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
    fetchLogStats();
    const intervalId = setInterval(fetchLogStats, 300000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <StatusWrapper>
      <StatusItem>
        <StatusLabel>전체 로그</StatusLabel>
        <StatusValue>{stats.totalLogsCount.toLocaleString()}</StatusValue>
      </StatusItem>
      <StatusItem $type="error">
        <StatusLabel>에러</StatusLabel>
        <StatusValue $type="error">{stats.errorLogsCount.toLocaleString()}</StatusValue>
      </StatusItem>
      <UpdateTimeWrapper>
        <UpdateTime>마지막 갱신: {timeString}</UpdateTime>
        <RefreshButton onClick={handleRefresh} disabled={refreshing}>
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
        </RefreshButton>
      </UpdateTimeWrapper>
    </StatusWrapper>
  );
};

export default RealtimeLogStatus;
