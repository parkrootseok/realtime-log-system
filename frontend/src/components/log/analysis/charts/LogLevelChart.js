import React from 'react';
import styled from 'styled-components';
import { Pie } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';

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

const LogLevelChart = ({ stats }) => {
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

  return (
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
  );
};

export default React.memo(LogLevelChart);
