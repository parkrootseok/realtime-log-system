import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

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

const TimeSeriesChart = ({
  title,
  timeSeriesData,
  timeUnit,
  onTimeUnitChange,
  source,
  hasData,
}) => {
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
    animation: source === 'realtime' ? false : true,
  };

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

  const renderTimeUnitToggle = () => {
    if (source === 'realtime') return null;

    return (
      <ToggleButtonGroup
        value={timeUnit}
        exclusive
        onChange={onTimeUnitChange}
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
  };

  return (
    <ChartContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <ChartTitle variant="h6">{title}</ChartTitle>
        {renderTimeUnitToggle()}
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
  );
};

export default React.memo(TimeSeriesChart);
