import React from 'react';
import { Line } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';
import { ChartContainer, ChartTitle, ChartContent } from './ChartStyles';
import { timeChartOptions, createTimeChartDataset } from '../../../constants/chartConfigs';

const TimeSeriesChart = ({ timeSeriesData = [] }) => {
  // 유효한 데이터만 필터링
  const validData = Array.isArray(timeSeriesData)
    ? timeSeriesData.filter((item) => item && item.timestamp && item.counts)
    : [];

  // 시간 포맷팅 유틸리티 함수
  const formatTimeKey = (time) => {
    try {
      const date = new Date(time);
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${hour}:${minute}`;
    } catch (error) {
      console.error('Invalid date format:', time);
      return 'Invalid';
    }
  };

  const timeChartData = {
    labels: validData.map((item) => formatTimeKey(item.timestamp)),
    datasets: [
      createTimeChartDataset(
        '전체',
        validData.map((item) =>
          Object.values(item.counts || {}).reduce((sum, count) => sum + (count || 0), 0)
        ),
        'total'
      ),
      createTimeChartDataset(
        'INFO',
        validData.map((item) => (item.counts && item.counts.INFO) || 0),
        'info'
      ),
      createTimeChartDataset(
        'WARN',
        validData.map((item) => (item.counts && item.counts.WARN) || 0),
        'warn'
      ),
      createTimeChartDataset(
        'ERROR',
        validData.map((item) => (item.counts && item.counts.ERROR) || 0),
        'error'
      ),
    ],
  };

  return (
    <ChartContainer>
      <ChartTitle variant="h6">실시간 로그 발생량</ChartTitle>
      <ChartContent>
        {validData.length > 0 ? (
          <Line
            data={timeChartData}
            options={{
              ...timeChartOptions,
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                ...timeChartOptions.scales,
                y: {
                  ...timeChartOptions.scales.y,
                  beginAtZero: true,
                },
              },
            }}
          />
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
      </ChartContent>
    </ChartContainer>
  );
};

export default TimeSeriesChart;
