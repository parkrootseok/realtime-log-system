import React from 'react';
import RealtimeLogAnalysis from './realtime/RealtimeLogAnalysis';
import UploadLogAnalysis from './upload/UploadLogAnalysis';

const LogAnalysis = ({ logs = [], source = 'upload', realtimeStats = null }) => {
  if (source === 'realtime') {
    return <RealtimeLogAnalysis logs={logs} realtimeStats={realtimeStats} />;
  }

  return <UploadLogAnalysis logs={logs} />;
};

export default LogAnalysis;
