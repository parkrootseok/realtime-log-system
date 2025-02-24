import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { logService } from '../services/api';

const StatusWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${(props) => (props.$type === 'error' ? '#FEF2F2' : '#F0F9FF')};
  border-radius: 8px;
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

const UploadLogStatus = ({ totalCount, errorCount }) => {
  return (
    <StatusWrapper>
      <StatusItem>
        <StatusLabel>전체 로그</StatusLabel>
        <StatusValue>{totalCount?.toLocaleString() || 0}</StatusValue>
      </StatusItem>
      <StatusItem $type="error">
        <StatusLabel>에러</StatusLabel>
        <StatusValue $type="error">{errorCount?.toLocaleString() || 0}</StatusValue>
      </StatusItem>
    </StatusWrapper>
  );
};

export default UploadLogStatus;
