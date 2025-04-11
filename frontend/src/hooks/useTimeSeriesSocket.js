import { useState, useEffect } from 'react';

export const useTimeSeriesSocket = () => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    let currentSocket = null;
    let retryTimeout = null;

    const connectSocket = () => {
      try {
        if (retryCount >= MAX_RETRIES) {
          console.error('Max retry attempts reached');
          setSocketStatus('failed');
          return;
        }

        if (!currentSocket || currentSocket.readyState === WebSocket.CLOSED) {
          const wsUrl = 'ws://localhost:8080/log/ws-distribution';
          currentSocket = new WebSocket(wsUrl);
          setSocketStatus('connecting');

          currentSocket.onopen = () => {
            setSocketStatus('connected');
            setRetryCount(0);
            currentSocket.send(JSON.stringify({ type: 'logDistribution' }));
          };

          currentSocket.onclose = (event) => {
            setSocketStatus('disconnected');
            if (event.code !== 1000) {
              setRetryCount((prev) => prev + 1);
              retryTimeout = setTimeout(
                () => connectSocket(),
                Math.min(1000 * Math.pow(2, retryCount), 10000)
              );
            }
          };

          currentSocket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.distribution) {
                const now = new Date();
                const formattedData = Object.entries(data.distribution)
                  .map(([timestamp, counts]) => {
                    if (!counts || typeof counts !== 'object') return null;
                    return {
                      timestamp,
                      counts: {
                        INFO: Number(counts.INFO || 0),
                        WARN: Number(counts.WARN || 0),
                        ERROR: Number(counts.ERROR || 0),
                      },
                    };
                  })
                  .filter((item) => item !== null)
                  .filter((item) => {
                    const itemTime = new Date(item.timestamp);
                    const diffMinutes = (now - itemTime) / (1000 * 60);
                    return diffMinutes <= 10;
                  })
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                if (formattedData.length > 0) {
                  setTimeSeriesData((prev) => {
                    const isDataDifferent = JSON.stringify(prev) !== JSON.stringify(formattedData);
                    return isDataDifferent ? formattedData : prev;
                  });
                }
              }
            } catch (error) {
              console.error('Error processing message:', error);
            }
          };

          currentSocket.onerror = () => {
            setSocketStatus('error');
          };
        }
      } catch (error) {
        setSocketStatus('error');
        setRetryCount((prev) => prev + 1);
      }
    };

    connectSocket();

    let isInitialConnection = true;
    const intervalId = setInterval(() => {
      if (currentSocket?.readyState === WebSocket.OPEN && !isInitialConnection) {
        currentSocket.send(JSON.stringify({ type: 'logDistribution' }));
      }
      isInitialConnection = false;
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(retryTimeout);
      if (currentSocket) {
        currentSocket.close(1000, 'Component unmounting');
      }
    };
  }, [retryCount]);

  return {
    timeSeriesData,
    socketStatus,
    isConnecting: socketStatus === 'connecting',
    isConnected: socketStatus === 'connected',
    hasError: socketStatus === 'error' || socketStatus === 'failed',
  };
};

export default useTimeSeriesSocket;
