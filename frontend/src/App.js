import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Title>로그 분석 시스템</Title>
        <p>초기 설정이 완료되었습니다!</p>
      </Container>
    </ThemeProvider>
  );
}

export default App;
