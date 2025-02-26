import React from 'react';
import styled from 'styled-components';
import { Box, Typography, Grid } from '@mui/material';

const StatsContainer = styled(Box)`
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
`;

const StatBox = styled(Box)`
  text-align: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
`;

const StatsOverview = ({ totalCount, errorRatio, warnRatio }) => {
  return (
    <StatsContainer>
      <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: 600 }}>
        통계 요약
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatBox>
            <Typography variant="body2" color="text.secondary">
              총 로그 수
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {totalCount.toLocaleString()}
            </Typography>
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox>
            <Typography variant="body2" color="text.secondary">
              에러 비율
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {errorRatio}%
            </Typography>
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox>
            <Typography variant="body2" color="text.secondary">
              경고 비율
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {warnRatio}%
            </Typography>
          </StatBox>
        </Grid>
      </Grid>
    </StatsContainer>
  );
};

export default React.memo(StatsOverview);
