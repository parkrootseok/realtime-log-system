import React, { useEffect } from 'react';
import LogViewer from './components/LogViewer';
import { createGlobalStyle } from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useRealtimeStore from './stores/realtimeStore';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const theme = createTheme({
  spacing: (factor) => `${8 * factor}px`,
});

function App() {
  const { resetRealtimeState } = useRealtimeStore();

  // 애플리케이션 종료 시 소켓 연결 정리
  useEffect(() => {
    // 브라우저 창이 닫히거나 새로고침될 때 소켓 연결 정리
    const handleBeforeUnload = () => {
      resetRealtimeState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      resetRealtimeState();
    };
  }, [resetRealtimeState]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LogViewer />
    </ThemeProvider>
  );
}

export default App;
