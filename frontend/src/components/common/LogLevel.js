import styled from 'styled-components';
import { LOG_LEVEL_STYLES } from '../../constants/logLevels';

export const LogLevel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  min-width: 55px;
  text-align: center;
  transition: all 0.2s ease;

  ${(props) => {
    const style = LOG_LEVEL_STYLES[props.level] || LOG_LEVEL_STYLES.DEFAULT;
    return `
      background: ${style.background};
      color: ${style.color};
    `;
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

export const getLevelDotColor = (level) => {
  const style = LOG_LEVEL_STYLES[level] || LOG_LEVEL_STYLES.DEFAULT;
  return style.dotColor;
};
