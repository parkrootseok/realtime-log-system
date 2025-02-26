import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import { TABLE_CONFIG } from '../../constants/config';

export const TableContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
`;

export const TableHeader = styled.div`
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

export const TableHeaderTop = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  border-bottom: 1px solid ${COLORS.grey[200]};
`;

export const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 200px 100px 1fr 2fr;
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  > div:nth-child(3),
  > div:nth-child(4) {
    justify-content: flex-start;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 200px 100px 1fr 2fr;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
  }

  > div:first-child {
    display: flex;
    justify-content: center;
  }

  > div:nth-child(2) {
    display: flex;
    justify-content: center;
  }
`;

export const TableCell = styled.div`
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableBody = styled.div`
  overflow-y: auto;
  flex: 1;

  max-height: ${TABLE_CONFIG.MAX_HEIGHT};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${COLORS.grey[50]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${COLORS.grey[200]};
    border-radius: 3px;
    transition: background-color 0.2s ease;

    &:hover {
      background: ${COLORS.grey[300]};
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: ${COLORS.grey[500]};
  font-size: 14px;
  background: #ffffff;
`;

const renderLogTable = (logsData) => (
  <TableContainer>
    <TableHeader>
      <TableHeaderRow>
        <div>타임스탬프</div>
        <div>레벨</div>
        <div>서비스</div>
        <div>메시지</div>
      </TableHeaderRow>
    </TableHeader>
    {/* ... 테이블 바디 ... */}
  </TableContainer>
);
