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

  useEffect(() => {

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
