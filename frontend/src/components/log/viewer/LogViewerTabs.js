import React from 'react';
import styled from 'styled-components';

const TabButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.$active ? '#f1f5f9' : 'transparent')};
  color: ${(props) => (props.$active ? '#0f172a' : '#64748b')};
  font-weight: ${(props) => (props.$active ? '600' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const TabText = styled.span`
  font-size: 14px;
`;

const ConnectionDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$connected ? '#22c55e' : '#ef4444')};
`;

const LogViewerTabs = ({ activeTab, setActiveTab, connected }) => {
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  return (
    <TabButtonContainer>
      <TabButton $active={activeTab === 'realtime'} onClick={() => handleTabChange('realtime')}>
        <TabText>실시간 로그 분석</TabText>
        <ConnectionDot $connected={connected} title={connected ? '연결됨' : '연결 끊김'} />
      </TabButton>
      <TabButton $active={activeTab === 'upload'} onClick={() => handleTabChange('upload')}>
        <TabText>업로드 로그 분석</TabText>
      </TabButton>
    </TabButtonContainer>
  );
};

export default LogViewerTabs;
