import React from 'react';
import styled from 'styled-components';

const StyledLogLevelCountBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 37px;
  background: ${(props) => (props.$type === 'error' ? '#FEF2F2' : '#F0F9FF')};
  border-radius: 8px;
  transition: all 0.2s ease;
`;

const StatusLabel = styled.span`
  color: #475569;
  font-size: 14px;
  font-weight: 500;
`;

const StatusValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.$type === 'error' ? '#DC2626' : '#3B82F6')};
`;

const LogLevelCountBox = ({ label, value, type }) => (
  <StyledLogLevelCountBox $type={type}>
    <StatusLabel>{label}</StatusLabel>
    <StatusValue $type={type}>{value}</StatusValue>
  </StyledLogLevelCountBox>
);

export default LogLevelCountBox;
