import styled from 'styled-components';

export const LogContainer = styled.div`
  padding: 32px 48px;
  max-width: 100%;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
`;

export const LeftSection = styled.div`
  width: 240px;
  flex-shrink: 0;
`;

export const LogContent = styled.div`
  flex: 1;
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 12px;
  background-color: #fef2f2;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
`;
