import React from 'react';
import RealtimeLogAnalysis from './analysis/RealtimeLogAnalysis';
import UploadLogAnalysis from './analysis/UploadLogAnalysis';

const LogAnalysis = ({ logs = [], source = 'upload', realtimeStats = null }) => {
  if (source === 'realtime') {
    return <RealtimeLogAnalysis logs={logs} realtimeStats={realtimeStats} />;
  }

  return <UploadLogAnalysis logs={logs} />;
};

export default LogAnalysis;
