import styled from 'styled-components';

export const LogLevel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  min-width: 55px;
  text-align: center;

  ${(props) => {
    switch (props.level) {
      case 'ERROR':
        return 'background: #fee2e2; color: #dc2626;';
      case 'WARN':
        return 'background: #fef3c7; color: #d97706;';
      case 'INFO':
        return 'background: #dbeafe; color: #2563eb;';
      default:
        return 'background: #f3f4f6; color: #4b5563;';
    }
  }}
`;

export const FilterTag = styled.div`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  background: ${(props) => (props.$selected ? '#e2e8f0' : '#ffffff')};
  color: ${(props) => (props.$selected ? '#1e293b' : '#64748b')};
  border: 1px solid ${(props) => (props.$selected ? '#cbd5e1' : '#e2e8f0')};
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: ${(props) => (props.$selected ? '500' : 'normal')};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$selected ? '#e2e8f0' : '#f8fafc')};
    border-color: ${(props) => (props.$selected ? '#cbd5e1' : '#cbd5e1')};
  }
`;
