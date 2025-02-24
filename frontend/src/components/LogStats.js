import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';

const StatsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatBox = styled.div`
  background: ${(props) => (props.$isError ? 'rgba(244, 67, 54, 0.1)' : 'rgba(33, 150, 243, 0.1)')};
  padding: 12px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  border: 1px solid
    ${(props) => (props.$isError ? 'rgba(244, 67, 54, 0.2)' : 'rgba(33, 150, 243, 0.2)')};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: ${(props) => (props.$isError ? '#f44336' : '#2196f3')};
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: #555;
    font-weight: 500;
  }
`;

const commonControlStyles = `
  height: 40px;
  min-width: 120px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
`;

const RefreshButton = styled.button`
  ${commonControlStyles}
  background: #2196f3;
  color: white;
  border: none;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .refresh-icon {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  &:hover {
    background: #1976d2;
    .refresh-icon {
      transform: rotate(180deg);
    }
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const IntervalSelect = styled.select`
  ${commonControlStyles}
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  color: #555;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }

  &:hover {
    border-color: #2196f3;
  }
`;

const RefreshControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 8px;
  padding-left: 16px;
  border-left: 1px solid #eee;
`;

const LogStats = () => {
  const [stats, setStats] = useState({ totalLogsCount: 0, errorLogsCount: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60000);

  const fetchLogStats = async () => {
    try {
      const response = await logService.analyzeLogs();
      setStats(response.data.data);
      /* eslint-disable no-console */
      console.log('통계 데이터 업데이트:', response.data.data);
      /* eslint-enable no-console */
    } catch (err) {
      /* eslint-disable no-console */
      console.error('로그 통계 조회 실패:', err);
      /* eslint-enable no-console */
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchLogStats();
    } catch (err) {
      /* eslint-disable no-console */
      console.error('통계 새로고침 실패:', err);
      /* eslint-enable no-console */
    } finally {
      setRefreshing(false);
    }
  };

  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value, 10);
    /* eslint-disable no-console */
    console.log('새로운 갱신 주기 설정:', newInterval);
    /* eslint-enable no-console */
    setRefreshInterval(newInterval);
  };

  useEffect(() => {
    /* eslint-disable no-console */
    console.log('갱신 주기 변경됨:', refreshInterval);
    /* eslint-enable no-console */

    // 초기 데이터 로드
    fetchLogStats();

    // 이전 인터벌 클리어
    let intervalId = setInterval(fetchLogStats, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval]); // refreshInterval이 변경될 때마다 interval 재설정

  return (
    <StatsContainer>
      <StatBox>
        <span className="stat-value">{stats.totalLogsCount.toLocaleString()}</span>
        <span className="stat-label">전체 로그</span>
      </StatBox>
      <StatBox $isError>
        <span className="stat-value">{stats.errorLogsCount.toLocaleString()}</span>
        <span className="stat-label">에러 로그</span>
      </StatBox>
      <RefreshControls>
        <RefreshButton onClick={handleRefresh} disabled={refreshing}>
          <span className="refresh-icon">↻</span>
          {refreshing ? '새로고침 중...' : '새로고침'}
        </RefreshButton>
        <IntervalSelect value={refreshInterval} onChange={handleIntervalChange}>
          <option value={30000}>30초마다</option>
          <option value={60000}>1분마다</option>
          <option value={180000}>3분마다</option>
          <option value={300000}>5분마다</option>
        </IntervalSelect>
      </RefreshControls>
    </StatsContainer>
  );
};

export default LogStats;
