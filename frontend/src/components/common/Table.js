import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  width: 100%;
  background-color: #f8fafc;
  border-bottom: 1px solid #eef2f6;
`;

export const TableHeaderTop = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  border-bottom: 1px solid #eef2f6;
`;

const gridTemplateColumns = '200px 100px 200px 1fr';

export const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${gridTemplateColumns};
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  background-color: #f8fafc;

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
  border-bottom: 1px solid #eef2f6;

  &:hover {
    background-color: #f8fafc;
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
`;

export const TableBody = styled.div`
  overflow-y: auto;
  max-height: 600px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;

    &:hover {
      background: #cbd5e1;
    }
  }
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
