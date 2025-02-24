import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  padding-bottom: 4px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatsContent = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const RefreshBox = styled(StatsBox)`
  padding: 0;
  min-width: auto;
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  border-radius: 6px;
  background: ${(props) => (props.$isError ? '#fff1f2' : '#f0f9ff')};

  .stat-value {
    font-size: 20px;
    font-weight: 600;
    color: ${(props) => (props.$isError ? '#f44336' : '#2196f3')};
  }

  .stat-label {
    font-size: 12px;
    color: #64748b;
  }
`;

const UpdateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  min-height: 28px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eef2f6;
`;

const UpdateInfo = styled.div`
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RefreshButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;

  .refresh-icon {
    font-size: 16px;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #f8fafc;
  }

  &:active .refresh-icon {
    transform: rotate(180deg);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const LogStats = () => {
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

  // 1분마다 시간 문자열 업데이트
  useEffect(() => {
    setTimeString(getRelativeTimeString()); // 초기값 설정
    const timer = setInterval(() => {
      setTimeString(getRelativeTimeString());
    }, 60000); // 1분 = 60000ms

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

  // 5분마다 자동 갱신
  useEffect(() => {
    fetchLogStats();
    const intervalId = setInterval(fetchLogStats, 300000); // 5분 = 300000ms

    return () => clearInterval(intervalId);
  }, []);

  return (
    <StatsContainer>
      <StatsBox>
        <StatBox>
          <span className="stat-label">전체 로그</span>
          <span className="stat-value">{stats.totalLogsCount.toLocaleString()}</span>
        </StatBox>
        <StatBox $isError>
          <span className="stat-label">에러</span>
          <span className="stat-value">{stats.errorLogsCount.toLocaleString()}</span>
        </StatBox>
        <UpdateContainer>
          <UpdateInfo>마지막 갱신: {timeString}</UpdateInfo>
          <RefreshButton
            onClick={handleRefresh}
            disabled={refreshing}
            title={refreshing ? '새로고침 중...' : '새로고침'}
          >
            <span className="refresh-icon">↻</span>
          </RefreshButton>
        </UpdateContainer>
      </StatsBox>
    </StatsContainer>
  );
};

export default LogStats;
