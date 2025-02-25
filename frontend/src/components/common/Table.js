import styled from 'styled-components';
import { COLORS } from '../../constants/colors';
import { TABLE_CONFIG } from '../../constants/config';

export const TableContainer = styled.div`
  width: 100%;
  border: 1px solid ${COLORS.grey[200]};
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
`;

export const TableHeader = styled.div`
  width: 100%;
  background-color: ${COLORS.grey[50]};
  border-bottom: 1px solid ${COLORS.grey[200]};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TableHeaderTop = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  border-bottom: 1px solid ${COLORS.grey[200]};
`;

export const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 180px 100px 150px 1fr;
  padding: 12px 16px;
  font-weight: 600;
  color: ${COLORS.grey[600]};
  font-size: 14px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 8px;
  }
`;

export const TableRow = styled(TableHeaderRow)`
  font-weight: normal;
  background-color: transparent;
  border-bottom: 1px solid ${COLORS.grey[200]};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${COLORS.grey[50]};
  }

  &:last-child {
    border-bottom: none;
  }

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > div:nth-child(1),
  > div:nth-child(2),
  > div:nth-child(3) {
    justify-content: center;
  }

  > div:last-child {
    justify-content: flex-start;
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${COLORS.grey[800]};
  font-size: 14px;
`;

export const TableBody = styled.div`
  overflow-y: auto;
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
