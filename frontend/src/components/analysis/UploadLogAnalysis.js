import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import styled from 'styled-components';
import { Pie, Bar } from 'react-chartjs-2';
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

// Chart.js 컴포넌트 등록
ChartJS.register(
  ArcElement, // Pie 차트용
  Tooltip,
  Legend,
  CategoryScale, // Bar 차트용
  LinearScale,
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

const UploadLogAnalysis = ({ logs = [] }) => {
  const uploadStats = useUploadStore((state) => state.stats);
  const uploadedFile = useUploadStore((state) => state.uploadedFile);
  const hasData = !!uploadedFile;

  // 원형 차트 데이터
  const pieChartData = {
    labels: ['INFO', 'WARN', 'ERROR'],
    datasets: [
      {
        data: [
          uploadStats?.infoCount || 0,
          uploadStats?.warnCount || 0,
          uploadStats?.errorCount || 0,
        ],
        backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
        borderColor: ['#2563eb', '#d97706', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  // 막대 차트 데이터
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
    hasData && totalCount ? Math.round(((uploadStats?.errorCount || 0) / totalCount) * 100) : 0;
  const warnRatio =
    hasData && totalCount ? Math.round(((uploadStats?.warnCount || 0) / totalCount) * 100) : 0;

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

export default UploadLogAnalysis;
