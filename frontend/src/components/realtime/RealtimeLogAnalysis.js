import React, { useEffect, useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';
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
  Title,
} from 'chart.js';
import useDistributionStore from '../../stores/distributionStore';
import useRealtimeLogStore from '../../stores/realtimeLogStore';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

const RealtimeLogAnalysis = ({ logs = [], realtimeStats = null }) => {
  // 분포 데이터 관련
  const {
    initDistributionSocket,
    distributionSocket,
    realtimeDistribution,
    setRealtimeDistribution,
  } = useDistributionStore();

  // 실시간 로그 관련
  const { initLogSocket, logSocket, realtimeLogs, addRealtimeLog } = useRealtimeLogStore();

  const hasData = !!realtimeStats || realtimeDistribution.length > 0;

  // 원형 차트 데이터
  const pieChartData = {
    labels: ['INFO', 'WARN', 'ERROR'],
    datasets: [
      {
        data: [
          realtimeStats?.infoCount || 0,
          realtimeStats?.warnCount || 0,
          realtimeStats?.errorCount || 0,
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderColor: ['#2563eb', '#d97706', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  const getTimeSeriesData = () => {
    if (!hasData) return [];

    if (realtimeDistribution.length > 0) {
      const now = new Date();
      const timeData = {};

      for (let i = -5; i < 5; i++) {
        const time = new Date(now);
        time.setMinutes(now.getMinutes() + i);
        time.setSeconds(0, 0);

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

      realtimeDistribution.forEach((item) => {
        const timestamp = new Date(item.timestamp);
        const hour = timestamp.getHours().toString().padStart(2, '0');
        const minute = timestamp.getMinutes().toString().padStart(2, '0');
        const timeKey = `${hour}:${minute}`;

        if (timeData[timeKey]) {
          const counts = item.counts || {};
          timeData[timeKey] = {
            time: timeKey,
            total: Object.values(counts).reduce((sum, count) => sum + count, 0),
            info: counts.INFO || 0,
            warn: counts.WARN || 0,
            error: counts.ERROR || 0,
          };
        }
      });

      return Object.values(timeData).sort((a, b) => a.time.localeCompare(b.time));
    }

    const now = new Date();
    const timeData = {};

    for (let i = -5; i < 5; i++) {
      const time = new Date(now);
      time.setMinutes(now.getMinutes() + i);
      time.setSeconds(0, 0);

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

    return Object.values(timeData).sort((a, b) => a.time.localeCompare(b.time));
  };

  useEffect(() => {
    // 분포 데이터용 소켓
    let currentDistributionSocket = distributionSocket;

    if (!currentDistributionSocket) {
      const wsUrl = 'ws://localhost:8080/log/ws-distribution';
      currentDistributionSocket = initDistributionSocket(wsUrl);
    }

    currentDistributionSocket.onopen = () => {
      currentDistributionSocket.send(JSON.stringify({ type: 'logDistribution' }));
    };

    currentDistributionSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📊 Distribution WebSocket data:', data);
      if (data.distribution) {
        const distributionData = Object.entries(data.distribution).map(([timestamp, counts]) => ({
          timestamp,
          counts,
        }));
        setRealtimeDistribution(distributionData);
      }
    };

    // 분포 데이터 주기적 요청
    const intervalId = setInterval(() => {
      if (currentDistributionSocket && currentDistributionSocket.readyState === WebSocket.OPEN) {
        currentDistributionSocket.send(JSON.stringify({ type: 'logDistribution' }));
      }
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [distributionSocket, initDistributionSocket, setRealtimeDistribution]);

  useEffect(() => {
    let currentLogSocket = logSocket;

    if (!currentLogSocket) {
      const wsUrl = 'ws://localhost:8080/logs-stream';
      currentLogSocket = initLogSocket(wsUrl);
    }

    currentLogSocket.onopen = () => {};

    currentLogSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.level && data.timestamp) {
        addRealtimeLog(data);

        setRealtimeDistribution((prev) => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const updatedDistribution = [...prevArray];
          const existingIndex = updatedDistribution.findIndex(
            (item) =>
              new Date(item.timestamp).getMinutes() === new Date(data.timestamp).getMinutes()
          );

          if (existingIndex !== -1) {
            const existing = updatedDistribution[existingIndex];
            updatedDistribution[existingIndex] = {
              timestamp: existing.timestamp,
              counts: {
                INFO: existing.counts.INFO + (data.info ? 1 : 0),
                WARN: existing.counts.WARN + (data.warn ? 1 : 0),
                ERROR: existing.counts.ERROR + (data.error ? 1 : 0),
              },
            };
          } else {
            updatedDistribution.push({
              timestamp: data.timestamp,
              counts: {
                INFO: data.info ? 1 : 0,
                WARN: data.warn ? 1 : 0,
                ERROR: data.error ? 1 : 0,
              },
            });
          }

          return updatedDistribution;
        });
      }
    };

    return () => {
      currentLogSocket.close();
    };
  }, [logSocket, initLogSocket, addRealtimeLog, setRealtimeDistribution]);

  useEffect(() => {}, [realtimeDistribution]);

  const timeSeriesData = useMemo(() => {
    return getTimeSeriesData();
  }, [realtimeDistribution, hasData]);

  const timeChartData = {
    labels: timeSeriesData.map((item) => item.time),
    datasets: [
      {
        label: '전체',
        data: timeSeriesData.map((item) => item.total),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        fill: false,
      },
      {
        label: 'INFO',
        data: timeSeriesData.map((item) => item.info),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: false,
      },
      {
        label: 'WARN',
        data: timeSeriesData.map((item) => item.warn),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        fill: false,
      },
      {
        label: 'ERROR',
        data: timeSeriesData.map((item) => item.error),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        fill: false,
      },
    ],
  };

  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        position: 'top',
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
  };

  const totalCount = realtimeStats?.totalLogsCount || 0;
  const errorRatio =
    hasData && totalCount ? Math.round(((realtimeStats?.errorCount || 0) / totalCount) * 100) : 0;
  const warnRatio =
    hasData && totalCount ? Math.round(((realtimeStats?.warnCount || 0) / totalCount) * 100) : 0;

  return (
    <AnalysisContainer>
      <Grid container spacing={3}>
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

        <Grid item xs={12} md={6}>
          <ChartContainer>
            <ChartTitle variant="h6">실시간 로그 발생량</ChartTitle>
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
                    실시간 로그 데이터가 수집되면 시간대별 로그 발생량이 표시됩니다.
                  </Typography>
                </Box>
              )}
            </Box>
          </ChartContainer>
        </Grid>

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

export default RealtimeLogAnalysis;
