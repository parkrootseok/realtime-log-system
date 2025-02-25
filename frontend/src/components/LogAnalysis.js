import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import styled from 'styled-components';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import useUploadStore from '../stores/uploadStore'; // uploadStore import

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const AnalysisContainer = styled.div`
  margin-top: 20px;
`;

const ChartContainer = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 600;
`;

const TimeUnitToggle = styled(ToggleButtonGroup)`
  margin-bottom: 16px;
  align-self: flex-end;
`;

// source prop 추가: 'realtime' 또는 'upload'
const LogAnalysis = ({ logs = [], source = 'upload', realtimeStats = null }) => {
  // 실시간 모드에서는 기본값을 'minute'로 설정
  const [timeUnit, setTimeUnit] = useState(source === 'realtime' ? 'minute' : 'day');
  // 실시간 모드에서 시간 간격 설정 (1분 단위로 고정)
  const [timeInterval, setTimeInterval] = useState('minute');

  // uploadStore에서 stats, 현재 파일 상태, 저장된 로그 데이터 가져오기
  const uploadStats = useUploadStore((state) => state.stats);
  const uploadedFile = useUploadStore((state) => state.uploadedFile);
  const uploadedLogs = useUploadStore((state) => state.logs || []);

  // 현재 모드에 맞는 로그 데이터 사용
  const currentLogs = source === 'realtime' ? logs : uploadedLogs.length > 0 ? uploadedLogs : logs;

  // source에 따라 적절한 stats 사용
  const stats = source === 'realtime' ? realtimeStats : uploadStats;
  const hasData = source === 'realtime' ? !!realtimeStats : !!uploadedFile;

  // 원형 차트 데이터 - 적절한 stats 사용
  const pieChartData = {
    labels: ['INFO', 'WARN', 'ERROR'],
    datasets: [
      {
        data: [stats?.infoCount || 0, stats?.warnCount || 0, stats?.errorCount || 0],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderColor: ['#2563eb', '#d97706', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const getTimeSeriesData = () => {
    if (!hasData || !currentLogs.length) return [];

    const timeData = {};

    // 실시간 모드에서 시간 데이터 초기화
    if (source === 'realtime') {
      const now = new Date();
      // 현재 시간 기준으로 과거 5분부터 미래 5분까지 총 11개 포인트 생성 (현재 포함)
      for (let i = -5; i <= 5; i++) {
        const time = new Date(now);
        time.setMinutes(now.getMinutes() + i);
        time.setSeconds(0, 0); // 초와 밀리초는 0으로 설정

        const hour = time.getHours().toString().padStart(2, '0');
        const minute = time.getMinutes().toString().padStart(2, '0');
        const timeKey = `${hour}:${minute}`;

        timeData[timeKey] = {
          time: timeKey,
          total: 0,
          info: 0,
          warn: 0,
          error: 0,
        };
      }
    }

    // 로그 데이터 처리
    currentLogs.forEach((log) => {
      const timestamp = typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;

      let timeKey;
      if (source === 'upload') {
        if (timeUnit === 'month') {
          // 월별 집계 (YYYY-MM 형식)
          const year = timestamp.getFullYear();
          const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
          timeKey = `${year}-${month}`;
        } else if (timeUnit === 'day') {
          // 일별 집계 (YYYY-MM-DD 형식)
          timeKey = timestamp.toISOString().split('T')[0];
        }
      } else {
        // 실시간 모드 - 1분 단위로 정확하게 맞추기
        // 초와 밀리초는 0으로 설정하여 정확히 1분 단위로 맞춤
        const roundedTimestamp = new Date(timestamp);
        roundedTimestamp.setSeconds(0, 0);

        const hour = roundedTimestamp.getHours().toString().padStart(2, '0');
        const minute = roundedTimestamp.getMinutes().toString().padStart(2, '0');
        timeKey = `${hour}:${minute}`;
      }

      // 해당 시간 키가 없으면 새로 생성 (실시간 모드에서도 범위 밖의 데이터 포함)
      if (!timeData[timeKey]) {
        timeData[timeKey] = {
          time: timeKey,
          displayTime:
            source === 'upload' && timeUnit === 'month'
              ? timeKey.replace(/(\d{4})-(\d{2})/, '$1년 $2월') // YYYY년 MM월 형식으로 표시
              : timeKey,
          total: 0,
          info: 0,
          warn: 0,
          error: 0,
        };
      }

      // 로그 카운트 증가
      timeData[timeKey].total += 1;

      const level = log.level.toLowerCase();
      if (level === 'info' || level === 'warn' || level === 'error') {
        timeData[timeKey][level] += 1;
      }
    });

    // 시간순으로 정렬
    return Object.values(timeData).sort((a, b) => a.time.localeCompare(b.time));
  };

  const timeSeriesData = getTimeSeriesData();

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    if (source === 'realtime') {
      console.log('1분 단위 시계열 데이터:', timeSeriesData);
    }
  }, [timeSeriesData, source]);

  const handleTimeUnitChange = (event, newTimeUnit) => {
    if (newTimeUnit !== null) {
      setTimeUnit(newTimeUnit);
    }
  };

  const handleTimeIntervalChange = (_, newInterval) => {
    if (newInterval !== null) {
      setTimeInterval(newInterval);
    }
  };

  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '로그 수',
        },
      },
      x: {
        title: {
          display: false,
        },
      },
    },
    // 실시간 모드에서 애니메이션 비활성화
    animation: source === 'realtime' ? false : true,
  };

  // 시계열 차트 데이터
  const timeChartData = {
    labels: timeSeriesData.map((item) => (source === 'realtime' ? item.time : item.time)),
    datasets: [
      {
        label: '전체',
        data: timeSeriesData.map((item) => item.total),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'INFO',
        data: timeSeriesData.map((item) => item.info),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'WARN',
        data: timeSeriesData.map((item) => item.warn),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
      },
      {
        label: 'ERROR',
        data: timeSeriesData.map((item) => item.error),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  // 총 로그 수 계산
  const totalCount =
    source === 'realtime' ? stats?.totalLogsCount || 0 : stats?.totalCount || currentLogs.length;

  // 에러 비율 계산
  const errorRatio = hasData && totalCount ? Math.round((stats.errorCount / totalCount) * 100) : 0;

  // 경고 비율 계산
  const warnRatio =
    hasData && totalCount && stats?.warnCount
      ? Math.round((stats.warnCount / totalCount) * 100)
      : 0;

  // 업로드 모드의 시간 단위 토글 버튼 렌더링
  const renderUploadTimeUnitToggle = () => (
    <ToggleButtonGroup
      value={timeUnit}
      exclusive
      onChange={handleTimeUnitChange}
      aria-label="시간 단위"
      size="small"
    >
      <ToggleButton value="day" aria-label="일별">
        일별
      </ToggleButton>
      <ToggleButton value="month" aria-label="월별">
        월별
      </ToggleButton>
    </ToggleButtonGroup>
  );

  // 실시간 모드의 시간 간격 토글 버튼 렌더링 - 제거
  const renderRealtimeIntervalToggle = () => {
    return null; // 토글 버튼 제거
  };

  return (
    <AnalysisContainer>
      <Grid container spacing={3}>
        {/* 로그 레벨 분포 차트 */}
        <Grid item xs={12} md={6}>
          <ChartContainer>
            <ChartTitle variant="h6">레벨 분포</ChartTitle>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </Box>
          </ChartContainer>
        </Grid>

        {/* 시간대별 로그 발생 차트 */}
        <Grid item xs={12} md={6}>
          <ChartContainer>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ChartTitle variant="h6">
                {source === 'realtime' ? '실시간 로그 발생량' : `로그 발생량`}
              </ChartTitle>
              {/* 업로드 모드에서만 토글 버튼 표시 */}
              {source === 'upload' && renderUploadTimeUnitToggle()}
            </Box>
            <Box sx={{ height: '100%', width: '100%' }}>
              {hasData ? (
                <Line data={timeChartData} options={timeChartOptions} />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {source === 'upload'
                      ? '파일을 업로드하면 시간대별 로그 발생량이 표시됩니다.'
                      : '실시간 로그 데이터가 수집되면 시간대별 로그 발생량이 표시됩니다.'}
                  </Typography>
                </Box>
              )}
            </Box>
          </ChartContainer>
        </Grid>

        {/* 추가 통계 정보 */}
        <Grid item xs={12}>
          <Box sx={{ background: '#f9fafb', borderRadius: '8px', padding: '20px' }}>
            <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 600 }}>
              통계 요약
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    총 로그 수
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {totalCount.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    에러 비율
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {errorRatio}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    padding: '16px',
                    background: '#fff',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    경고 비율
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {warnRatio}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </AnalysisContainer>
  );
};

export default LogAnalysis;
