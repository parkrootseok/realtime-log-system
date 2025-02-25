import React from 'react';
import styled from 'styled-components';
import StatusItem from './common/StatusItem';

const StatusWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const UploadLogStatus = ({ totalCount, errorCount }) => {
  return (
    <StatusWrapper>
      <StatusItem label="전체 로그" value={totalCount.toLocaleString()} />
      <StatusItem label="에러" value={errorCount.toLocaleString()} type="error" />
    </StatusWrapper>
  );
};

export default UploadLogStatus;
