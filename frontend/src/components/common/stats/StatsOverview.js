import React from 'react';
import { Typography, Grid } from '@mui/material';
import { StatsContainer, ChartTitle, StatCard } from '../charts/ChartStyles';

const StatsOverview = ({ totalCount, errorRatio, warnRatio }) => {
  return (
    <StatsContainer>
      <ChartTitle variant="h6">통계 요약</ChartTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              총 로그 수
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {totalCount.toLocaleString()}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              에러 비율
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {errorRatio}%
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              경고 비율
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {warnRatio}%
            </Typography>
          </StatCard>
        </Grid>
      </Grid>
    </StatsContainer>
  );
};

export default StatsOverview;
