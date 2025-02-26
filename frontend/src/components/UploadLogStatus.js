import React from 'react';
import styled from 'styled-components';
import StatusItem from './common/StatusItem';
import useUploadStore from '../stores/uploadStore';

const StatusWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const UploadLogStatus = () => {
  const stats = useUploadStore((state) => state.stats);
  const totalCount = stats?.totalCount || 0;
  const errorCount = stats?.errorCount || 0;

  return (
    <StatusWrapper>
      <StatusItem label="전체 로그" value={totalCount.toLocaleString()} />
      <StatusItem label="에러" value={errorCount.toLocaleString()} type="error" />
    </StatusWrapper>
  );
};

export default UploadLogStatus;
