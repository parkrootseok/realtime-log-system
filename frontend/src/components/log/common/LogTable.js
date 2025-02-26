import React from 'react';
import {
  TableContainer,
  TableHeader,
  TableHeaderRow,
  TableRow,
  TableCell,
  TableBody,
} from '../../common/Table';
import { LogLevel } from '../../common/LogLevel';

const LogTable = React.memo(
  ({ logs = [], emptyMessage = '로그 데이터가 없습니다.' }) => {
    // 빈 로그 행 생성 (20개 행 유지)
    const emptyRows = Array(20 - logs.length).fill(null);

    return (
      <TableContainer>
        <TableHeader>
          <TableHeaderRow>
            <div>발생시각</div>
            <div>레벨</div>
            <div>발생위치</div>
            <div>메시지</div>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const timestamp =
              typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;

            return (
              <TableRow key={`${timestamp.getTime()}-${log.serviceName}-${log.message}`}>
                <TableCell>{timestamp.toLocaleString()}</TableCell>
                <TableCell>
                  <LogLevel $level={log.level}>{log.level}</LogLevel>
                </TableCell>
                <TableCell>{log.serviceName}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            );
          })}
          {emptyRows.map((_, index) => (
            <TableRow key={`empty-${index}`}>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    );
  },
  (prevProps, nextProps) => {
    // 로그 데이터가 변경되지 않았으면 리렌더링하지 않음
    const getLastTimestamp = (logs) => {
      if (!logs || logs.length === 0) return null;
      const lastLog = logs[logs.length - 1];
      return typeof lastLog.timestamp === 'string'
        ? new Date(lastLog.timestamp).getTime()
        : lastLog.timestamp.getTime();
    };

    return (
      prevProps.logs.length === nextProps.logs.length &&
      getLastTimestamp(prevProps.logs) === getLastTimestamp(nextProps.logs)
    );
  }
);

LogTable.displayName = 'LogTable';

export default LogTable;
