import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import useUploadStore from '../../stores/uploadStore';
import LogPieChart from '../common/charts/LogPieChart';
import StatsOverview from '../common/stats/StatsOverview';
import { ChartContainer, ChartTitle } from '../common/charts/ChartStyles';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalysisContainer = styled.div`
  margin-top: 20px;
`;

const UploadLogAnalysis = ({ logs = [] }) => {
  const uploadStats = useUploadStore((state) => state.stats);
  const uploadedFile = useUploadStore((state) => state.uploadedFile);
  const hasData = !!uploadedFile;

  // 파이 차트용 데이터 포맷 변환
  const pieChartData = {
    infoCount: uploadStats?.infoCount || 0,
    warnCount: uploadStats?.warnCount || 0,
    errorCount: uploadStats?.errorCount || 0,
  };

  const barChartData = {
    labels: ['INFO', 'WARN', 'ERROR'],
    datasets: [
      {
        data: [
          uploadStats?.infoCount || 0,
          uploadStats?.warnCount || 0,
          uploadStats?.errorCount || 0,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const totalCount = uploadStats?.totalCount || 0;
  const errorRatio =
    hasData && totalCount ? Math.round((uploadStats?.errorCount / totalCount) * 100) : 0;
  const warnRatio =
    hasData && totalCount ? Math.round((uploadStats?.warnCount / totalCount) * 100) : 0;

  return (
    <AnalysisContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LogPieChart data={pieChartData} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer>
            <ChartTitle variant="h6">로그 레벨 분포</ChartTitle>
            <Box sx={{ height: '100%', width: '100%' }}>
              {hasData ? (
                <Bar data={barChartData} options={barChartOptions} />
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
        </Grid>

        <Grid item xs={12}>
          <StatsOverview totalCount={totalCount} errorRatio={errorRatio} warnRatio={warnRatio} />
        </Grid>
      </Grid>
    </AnalysisContainer>
  );
};

export default UploadLogAnalysis;
