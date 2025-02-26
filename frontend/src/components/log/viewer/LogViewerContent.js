import React from 'react';
import styled from 'styled-components';
import RealtimeMonitoring from '../realtime/RealtimeMonitoring';
import UploadMonitoring from '../upload/UploadMonitoring';

const LogContent = styled.div`
  flex: 1;
`;

const ErrorBox = styled.div`
  color: #dc2626;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const LogViewerContent = ({
  activeTab,
  logs,
  uploadedFile,
  uploadSuccess,
  uploadError,
  connected,
  error,
}) => {
  return (
    <LogContent>
      {error && <ErrorBox>{error}</ErrorBox>}
      {activeTab === 'realtime' ? (
        <RealtimeMonitoring logs={logs} />
      ) : (
        <UploadMonitoring
          uploadedFile={uploadedFile}
          onUploadStatusChange={({ success, error }) => {
            if (success) {
              setUploadSuccess(true);
            } else {
              setUploadError(error || '업로드에 실패했습니다.');
            }
          }}
        />
      )}
    </LogContent>
  );
};

export default LogViewerContent;
