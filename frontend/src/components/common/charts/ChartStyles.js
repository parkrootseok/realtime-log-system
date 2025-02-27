import styled from 'styled-components';
import { Typography } from '@mui/material';

// 기본 카드 스타일
const cardStyle = `
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

export const ChartContainer = styled.div`
  ${cardStyle}
  padding: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

export const ChartContent = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
  width: 100%;
  height: 100%;
`;

export const ChartTitle = styled(Typography)`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const StatsContainer = styled.div`
  ${cardStyle}
  padding: 20px;
`;

export const StatCard = styled.div`
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;
`;

export const AnalysisContainer = styled.div`
  margin
`;
