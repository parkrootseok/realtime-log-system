import React, { useState } from 'react';
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

// Chart.js 컴포넌트 등록
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

const LogAnalysis = ({ logs = [] }) => {
  const [timeUnit, setTimeUnit] = useState('day');

  // uploadStore에서 stats와 현재 파일 상태 가져오기
  const stats = useUploadStore((state) => state.stats);
  const uploadedFile = useUploadStore((state) => state.uploadedFile);

  // 원형 차트 데이터 - uploadStore의 stats 사용
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

  // 시간대별 로그 데이터 계산
  const getTimeSeriesData = () => {
    // 파일이 업로드되지 않았거나 로그가 없으면 빈 배열 반환
    if (!uploadedFile || !logs.length) return [];

    const timeData = {};

    logs.forEach((log) => {
      const timestamp = typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;

      let timeKey;
      if (timeUnit === 'day') {
        timeKey = timestamp.toISOString().split('T')[0];
      } else {
        const date = timestamp.toISOString().split('T')[0];
        const hour = timestamp.getHours().toString().padStart(2, '0');
        timeKey = `${date} ${hour}:00`;
      }

      if (!timeData[timeKey]) {
        timeData[timeKey] = {
          time: timeKey,
          total: 0,
          info: 0,
          warn: 0,
          error: 0,
        };
      }

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

  // 시간 단위 변경 핸들러
  const handleTimeUnitChange = (_, newUnit) => {
    if (newUnit !== null) {
      setTimeUnit(newUnit);
    }
  };

  // 시계열 차트 옵션
  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: timeUnit === 'day' ? '일별 로그 발생량' : '시간별 로그 발생량',
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
          display: true,
          text: timeUnit === 'day' ? '날짜' : '시간',
        },
      },
    },
  };

  // 시계열 차트 데이터
  const timeChartData = {
    labels: timeSeriesData.map((item) => item.time),
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

  return (
    <AnalysisContainer>
      <Grid container spacing={3}>
        {/* 로그 레벨 분포 차트 */}
        <Grid item xs={12} md={6}>
          <ChartContainer>
            <ChartTitle variant="h6">로그 레벨 분포</ChartTitle>
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
              <ChartTitle variant="h6">시간대별 로그 발생량</ChartTitle>
              <TimeUnitToggle
                value={timeUnit}
                exclusive
                onChange={handleTimeUnitChange}
                aria-label="시간 단위"
                size="small"
              >
                <ToggleButton value="day" aria-label="일 단위">
                  일별
                </ToggleButton>
                <ToggleButton value="hour" aria-label="시간 단위">
                  시간별
                </ToggleButton>
              </TimeUnitToggle>
            </Box>
            <Box sx={{ height: '100%', width: '100%' }}>
              {uploadedFile ? (
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
                    파일을 업로드하면 시간대별 로그 발생량이 표시됩니다.
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
              로그 통계 요약
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
                    {uploadedFile ? stats?.totalCount || logs.length : 0}
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
                    {uploadedFile && stats?.totalCount
                      ? Math.round((stats.errorCount / stats.totalCount) * 100)
                      : 0}
                    %
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
                    {uploadedFile && stats?.totalCount
                      ? Math.round((stats.warnCount / stats.totalCount) * 100)
                      : 0}
                    %
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
