import React, { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import useTimeSeriesSocket from '../../hooks/useTimeSeriesSocket';
import LogPieChart from '../common/charts/LogPieChart';
import TimeSeriesChart from '../common/charts/TimeSeriesChart';
import StatsOverview from '../common/stats/StatsOverview';

const RealtimeLogAnalysis = ({ logs = [], realtimeStats = null }) => {
  const { timeSeriesData } = useTimeSeriesSocket();

  const levelCounts = useMemo(() => {
    return (logs || []).reduce(
      (acc, log) => {
        // Check if log exists and has a level property
        if (!log || typeof log.level === 'undefined') {
          return acc;
        }

        return {
          infoCount: acc.infoCount + (log.level === 'INFO' ? 1 : 0),
          warnCount: acc.warnCount + (log.level === 'WARN' ? 1 : 0),
          errorCount: acc.errorCount + (log.level === 'ERROR' ? 1 : 0),
          totalLogsCount: acc.totalLogsCount + 1,
        };
      },
      {
        infoCount: realtimeStats?.infoCount || 0,
        warnCount: realtimeStats?.warnCount || 0,
        errorCount: realtimeStats?.errorCount || 0,
        totalLogsCount: realtimeStats?.totalLogsCount || 0,
      }
    );
  }, [logs, realtimeStats]);

  const hasData = levelCounts.totalLogsCount > 0 || timeSeriesData.length > 0;
  const totalCount = levelCounts.totalLogsCount;
  const errorRatio =
    hasData && totalCount ? Math.round((levelCounts.errorCount / totalCount) * 100) : 0;
  const warnRatio =
    hasData && totalCount ? Math.round((levelCounts.warnCount / totalCount) * 100) : 0;

  return (
    <Box sx={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <Grid container spacing={3} sx={{ maxWidth: '100%' }}>
        <Grid item xs={12}>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} md={6} sx={{ maxWidth: '600px' }}>
              <LogPieChart data={levelCounts} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ maxWidth: '600px' }}>
              <TimeSeriesChart timeSeriesData={timeSeriesData} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <StatsOverview totalCount={totalCount} errorRatio={errorRatio} warnRatio={warnRatio} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealtimeLogAnalysis;
