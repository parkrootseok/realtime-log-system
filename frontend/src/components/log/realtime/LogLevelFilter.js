import React from 'react';
import styled from 'styled-components';
import { Chip, CircularProgress } from '@mui/material';

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledChip = styled(Chip)`
  &.MuiChip-root {
    font-weight: 500;

    &.level-ERROR {
      background-color: ${(props) => (props.selected ? '#fee2e2' : '#fef2f2')};
      color: #dc2626;
      border: 1px solid ${(props) => (props.selected ? '#dc2626' : '#fecaca')};

      &:hover {
        background-color: #fee2e2;
      }
    }

    &.level-WARN {
      background-color: ${(props) => (props.selected ? '#fef3c7' : '#fffbeb')};
      color: #d97706;
      border: 1px solid ${(props) => (props.selected ? '#d97706' : '#fcd34d')};

      &:hover {
        background-color: #fef3c7;
      }
    }

    &.level-INFO {
      background-color: ${(props) => (props.selected ? '#dbeafe' : '#eff6ff')};
      color: #2563eb;
      border: 1px solid ${(props) => (props.selected ? '#2563eb' : '#93c5fd')};

      &:hover {
        background-color: #dbeafe;
      }
    }
  }
`;

const LoadingWrapper = styled.div`
  margin-left: 8px;
`;

const LogLevelFilter = ({ selectedLevels = [], onToggle, isLoading }) => {
  const levels = [
    { label: '에러', value: 'ERROR' },
    { label: '경고', value: 'WARN' },
    { label: '정보', value: 'INFO' },
  ];

  return (
    <FilterContainer>
      {levels.map(({ label, value }) => (
        <StyledChip
          key={value}
          label={label}
          onClick={() => onToggle(value)}
          className={`level-${value}`}
          selected={selectedLevels.includes(value)}
          disabled={isLoading}
          variant="outlined"
        />
      ))}
      {isLoading && (
        <LoadingWrapper>
          <CircularProgress size={20} />
        </LoadingWrapper>
      )}
    </FilterContainer>
  );
};

export default React.memo(LogLevelFilter);
