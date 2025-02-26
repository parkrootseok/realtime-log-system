import { create } from 'zustand';

const useRealtimeStore = create((set, get) => ({
  // 연결 상태
  connected: false,
  error: null,

  // 로그 상태
  logs: [],
  selectedLevels: ['ERROR', 'WARN', 'INFO'],
  filteredLogs: [],
  filterLoading: false,
  filterError: null,
  activeTab: 0,

  // 소켓 관련 상태
  socket: null,
  distributionSocket: null,
  realtimeDistribution: [],
  
  // 로그 통계 상태 (RealtimeLogStatus와 LogAnalysis 간 공유)
  logStats: {
    totalLogsCount: 0,
    errorCount: 0,
    infoCount: 0,
    warnCount: 0,
    lastUpdate: new Date()
  },

  // 액션
  setConnected: (status) => set({ connected: status }),
  setError: (error) => set({ error }),
  setLogs: (logs) => set({ logs }),
  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs.slice(0, 19)],
    })),
  setSelectedLevels: (levels) => set({ selectedLevels: levels }),
  setFilteredLogs: (logs) => set({ filteredLogs: logs }),
  setFilterLoading: (loading) => set({ filterLoading: loading }),
  setFilterError: (error) => set({ filterError: error }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRealtimeDistribution: (data) => set({ realtimeDistribution: data }),
  
  // 로그 통계 업데이트
  updateLogStats: (stats) => set({
    logStats: {
      ...stats,
      lastUpdate: new Date()
    }
  }),

  // 소켓 연결 관리
  initSocket: (url) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      return socket; // 이미 연결된 소켓이 있으면 재사용
    }

    const newSocket = new WebSocket(url);
    set({ socket: newSocket });
    return newSocket;
  },

  initDistributionSocket: (url) => {
    const { distributionSocket } = get();
    if (distributionSocket && distributionSocket.readyState === WebSocket.OPEN) {
      return distributionSocket; // 이미 연결된 소켓이 있으면 재사용
    }

    const newSocket = new WebSocket(url);
    set({ distributionSocket: newSocket });
    return newSocket;
  },

  closeSocket: () => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    set({ socket: null });
  },

  closeDistributionSocket: () => {
    const { distributionSocket } = get();
    if (distributionSocket && distributionSocket.readyState === WebSocket.OPEN) {
      distributionSocket.close();
    }
    set({ distributionSocket: null });
  },

  // 초기화
  resetRealtimeState: () => {
    const { closeSocket, closeDistributionSocket } = get();
    closeSocket();
    closeDistributionSocket();
    
    set({
      connected: false,
      error: null,
      logs: [],
      selectedLevels: ['ERROR', 'WARN', 'INFO'],
      filteredLogs: [],
      filterLoading: false,
      filterError: null,
      activeTab: 0,
      realtimeDistribution: [],
      logStats: {
        totalLogsCount: 0,
        errorCount: 0,
        infoCount: 0,
        warnCount: 0,
        lastUpdate: new Date()
      }
    });
  },
}));

export default useRealtimeStore;
