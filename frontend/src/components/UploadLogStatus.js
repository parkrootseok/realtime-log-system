import React from 'react';
import styled from 'styled-components';

const StatusWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
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

const UploadLogStatus = ({ totalCount = 0, errorCount = 0 }) => (
  <StatusWrapper>
    <StatusItem>
      <StatusLabel>전체 로그</StatusLabel>
      <StatusValue>{totalCount.toLocaleString()}</StatusValue>
    </StatusItem>
    <StatusItem $type="error">
      <StatusLabel>에러</StatusLabel>
      <StatusValue $type="error">{errorCount.toLocaleString()}</StatusValue>
    </StatusItem>
  </StatusWrapper>
);

export default UploadLogStatus;
