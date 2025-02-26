import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import useUploadStore from '../../../stores/uploadStore';
import useRealtimeStore from '../../../stores/realtimeStore';
import LogLevelChart from './charts/LogLevelChart';
import TimeSeriesChart from './charts/TimeSeriesChart';
import StatsOverview from './StatsOverview';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const AnalysisContainer = styled.div`
  margin-top: 20px;
`;

const LogAnalysis = ({ logs = [], source = 'upload', realtimeStats = null }) => {
  console.log('=== LogAnalysis 컴포넌트 렌더링 ===');
  console.log('Props:', { logs, source, realtimeStats });

  const [timeUnit, setTimeUnit] = useState(source === 'realtime' ? 'minute' : 'day');
  const [realtimeDistribution, setRealtimeDistribution] = useState([]);
  const { initDistributionSocket, setRealtimeDistribution: setGlobalRealtimeDistribution } =
    useRealtimeStore();

  const uploadStats = useUploadStore((state) => state.stats);
  const uploadedLogs = useUploadStore((state) => state.logs || []);
  const realtimeLogs = useRealtimeStore((state) => state.logs || []);
  const realtimeStoreStats = useRealtimeStore((state) => state.stats);

  console.log('=== Store 데이터 ===');
  console.log('source:', source);
  console.log('uploadStats:', uploadStats);
  console.log('realtimeStats:', realtimeStoreStats);
  console.log('uploadedLogs:', uploadedLogs);
  console.log('realtimeLogs:', realtimeLogs);

  const currentLogs = source === 'realtime' ? realtimeLogs : uploadedLogs;
  const stats = source === 'realtime' ? realtimeStoreStats : uploadStats;
  const hasData =
    source === 'realtime' ? !!realtimeStoreStats || realtimeDistribution.length > 0 : !!stats;

  console.log('=== 계산된 값 ===');
  console.log('currentLogs:', currentLogs);
  console.log('stats:', stats);
  console.log('hasData:', hasData);

  const timeSeriesData = useMemo(() => {
    console.log('=== timeSeriesData useMemo 실행 ===');
    console.log('Dependencies:', {
      currentLogsLength: currentLogs?.length,
      timeUnit,
      source,
      realtimeDistributionLength: realtimeDistribution.length,
      hasData,
      stats,
    });

    if (!hasData) {
      console.log('데이터 없음으로 빈 배열 반환');
      return [];
    }

    // 업로드 모드일 때의 처리
    if (source === 'upload') {
      console.log('업로드 모드 timeSeriesData 생성');
      console.log('업로드된 로그 수:', currentLogs?.length);
      console.log('업로드 stats:', stats);

      if (!currentLogs?.length || !stats) {
        return [];
      }

      const timeData = {};

      currentLogs.forEach((log) => {
        const timestamp =
          typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;
        let timeKey;

        if (timeUnit === 'month') {
          const year = timestamp.getFullYear();
          const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
          timeKey = `${year}-${month}`;
        } else {
          timeKey = timestamp.toISOString().split('T')[0];
        }

        if (!timeData[timeKey]) {
          timeData[timeKey] = {
            time: timeKey,
            displayTime:
              timeUnit === 'month' ? timeKey.replace(/(\d{4})-(\d{2})/, '$1년 $2월') : timeKey,
            total: 0,
            info: 0,
            warn: 0,
            error: 0,
          };
        }

        timeData[timeKey].total += 1;

        const level = log.level.toLowerCase();
        if (level === 'info' || level === 'warn' || level === 'error') {
          timeData[timeKey][level] += 1;
        }
      });

      const result = Object.values(timeData).sort((a, b) => a.time.localeCompare(b.time));
      console.log('생성된 업로드 timeSeriesData:', result);

      // 전체 합계 검증
      const totalSum = result.reduce((sum, item) => sum + item.total, 0);
      console.log('timeSeriesData 전체 합계:', totalSum);
      console.log('stats.totalCount:', stats.totalCount);

      return result;
    }

    // 실시간 모드일 때의 처리
    if (realtimeDistribution.length > 0) {
      return realtimeDistribution
        .map((item) => {
          const timestamp = new Date(item.timestamp);
          const hour = timestamp.getHours().toString().padStart(2, '0');
          const minute = timestamp.getMinutes().toString().padStart(2, '0');
          const timeKey = `${hour}:${minute}`;

          const counts = item.counts || {};

          return {
            time: timeKey,
            total: Object.values(counts).reduce((sum, count) => sum + count, 0),
            info: counts.INFO || 0,
            warn: counts.WARN || 0,
            error: counts.ERROR || 0,
          };
        })
        .sort((a, b) => a.time.localeCompare(b.time));
    }

    // 실시간 모드의 기본 타임라인 생성
    const timeData = {};
    const now = new Date();
    for (let i = -5; i <= 5; i++) {
      const time = new Date(now);
      time.setMinutes(now.getMinutes() + i);
      time.setSeconds(0, 0);

      const hour = time.getHours().toString().padStart(2, '0');
      const minute = time.getMinutes().toString().padStart(2, '0');
      const timeKey = `${hour}:${minute}`;

      timeData[timeKey] = {
        time: timeKey,
        total: 0,
        info: 0,
        warn: 0,
        error: 0,
      };
    }

    return Object.values(timeData).sort((a, b) => a.time.localeCompare(b.time));
  }, [currentLogs, timeUnit, source, realtimeDistribution, hasData, stats]);

  console.log('=== 최종 timeSeriesData ===', timeSeriesData);

  useEffect(() => {
    if (source !== 'realtime') return;

    const wsUrl = 'ws://localhost:8080/log/ws-distribution';
    const socket = initDistributionSocket(wsUrl);

    const sendDistributionRequest = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'logDistribution' }));
      }
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendDistributionRequest();
    }

    socket.onopen = () => {
      sendDistributionRequest();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isDistributionData =
          Array.isArray(data) && data.length > 0 && data[0].timestamp && data[0].counts;

        if (isDistributionData) {
          setRealtimeDistribution(data);
          setGlobalRealtimeDistribution(data);
        }
      } catch (error) {
        console.error('시계열 데이터 수집: 데이터 파싱 오류 발생', error);
      }
    };

    const intervalId = setInterval(
      () => {
        sendDistributionRequest();
      },
      10 * 60 * 1000
    );

    return () => {
      clearInterval(intervalId);
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
    };
  }, [source]);

  const handleTimeUnitChange = (event, newTimeUnit) => {
    if (newTimeUnit !== null) {
      setTimeUnit(newTimeUnit);
    }
  };

  const totalCount = source === 'realtime' ? stats?.totalLogsCount || 0 : stats?.totalCount || 0;

  const errorRatio =
    hasData && totalCount && stats ? Math.round(((stats.errorCount || 0) / totalCount) * 100) : 0;

  const warnRatio =
    hasData && totalCount && stats ? Math.round(((stats.warnCount || 0) / totalCount) * 100) : 0;

  return (
    <AnalysisContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LogLevelChart stats={stats} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimeSeriesChart
            title={source === 'realtime' ? '실시간 로그 발생량' : '로그 발생량'}
            timeSeriesData={timeSeriesData}
            timeUnit={timeUnit}
            onTimeUnitChange={handleTimeUnitChange}
            source={source}
            hasData={hasData && currentLogs?.length > 0}
            stats={stats}
          />
        </Grid>
        <Grid item xs={12}>
          <StatsOverview totalCount={totalCount} errorRatio={errorRatio} warnRatio={warnRatio} />
        </Grid>
      </Grid>
    </AnalysisContainer>
  );
};

export default LogAnalysis;
