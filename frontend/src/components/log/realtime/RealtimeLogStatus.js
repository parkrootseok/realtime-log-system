import React from 'react';
import styled from 'styled-components';
import { Paper, Typography, Grid } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const StatusContainer = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  background-color: #f8fafc;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled(Typography)`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.color || '#1e293b'};
  margin-bottom: 8px;
`;

const StatLabel = styled(Typography)`
  color: #64748b;
  font-size: 14px;
`;

const UpdateInfo = styled(Typography)`
  color: #64748b;
  font-size: 12px;
  text-align: right;
  margin-top: 8px;
`;

const RealtimeLogStatus = ({ stats, lastUpdate }) => {
  const { totalLogsCount = 0, errorCount = 0, warnCount = 0, infoCount = 0 } = stats;

  return (
    <StatusContainer elevation={0}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem>
            <StatValue>{totalLogsCount.toLocaleString()}</StatValue>
            <StatLabel>전체 로그</StatLabel>
          </StatItem>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem>
            <StatValue color="#dc2626">{errorCount.toLocaleString()}</StatValue>
            <StatLabel>에러</StatLabel>
          </StatItem>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem>
            <StatValue color="#f59e0b">{warnCount.toLocaleString()}</StatValue>
            <StatLabel>경고</StatLabel>
          </StatItem>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatItem>
            <StatValue color="#2563eb">{infoCount.toLocaleString()}</StatValue>
            <StatLabel>정보</StatLabel>
          </StatItem>
        </Grid>
      </Grid>
      {lastUpdate && (
        <UpdateInfo>
          마지막 업데이트:{' '}
          {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true, locale: ko })}
        </UpdateInfo>
      )}
    </StatusContainer>
  );
};

export default React.memo(RealtimeLogStatus);
