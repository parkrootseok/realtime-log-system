import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ChartContainer, ChartTitle } from './ChartStyles';
import { Box, Typography } from '@mui/material';

export const LogPieChart = ({ data }) => {
  const hasData = data && (data.infoCount > 0 || data.warnCount > 0 || data.errorCount > 0);

  const pieChartData = {
    labels: ['INFO', 'WARN', 'ERROR'],
    datasets: [
      {
        data: [data?.infoCount || 0, data?.warnCount || 0, data?.errorCount || 0],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderColor: ['#2563eb', '#d97706', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <ChartContainer>
      <ChartTitle variant="h6">레벨 분포</ChartTitle>
      <Box sx={{ flex: 1, position: 'relative' }}>
        {hasData ? (
          <Pie
            data={pieChartData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
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
              파일을 업로드하면 로그 레벨 분포가 표시됩니다.
            </Typography>
          </Box>
        )}
      </Box>
    </ChartContainer>
  );
};

export default LogPieChart;
