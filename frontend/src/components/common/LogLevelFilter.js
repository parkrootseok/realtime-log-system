import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 35px;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  color: #4b5563;

  &:hover {
    border-color: #d1d5db;
    background: #f8fafc;
  }

  ${(props) =>
    props.$selected &&
    `
    background: #ffffff;
    color: #111827;
    border-color: #9ca3af;
    
    &:hover {
      background: #f8fafc;
      border-color: #6b7280;
    }
  `}

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.4;
    pointer-events: none;
    cursor: not-allowed;
  `}
`;

const LevelDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const LogLevelFilter = ({ selectedLevels, onToggle, isLoading }) => {
  const levels = ['ERROR', 'WARN', 'INFO'];
  const levelColors = {
    ERROR: '#ef4444',
    WARN: '#f97316',
    INFO: '#0ea5e9',
  };

  return (
    <FilterContainer>
      {levels.map((level) => (
        <FilterTag
          key={level}
          $selected={selectedLevels.includes(level)}
          onClick={() => !isLoading && onToggle(level)}
          disabled={isLoading}
        >
          <LevelDot color={levelColors[level]} />
          {level}
        </FilterTag>
      ))}
    </FilterContainer>
  );
};

export default LogLevelFilter;
