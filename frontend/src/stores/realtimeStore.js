import { create } from 'zustand';

const useRealtimeStore = create((set) => ({
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

  // 초기화
  resetRealtimeState: () =>
    set({
      connected: false,
      error: null,
      logs: [],
      selectedLevels: ['ERROR', 'WARN', 'INFO'],
      filteredLogs: [],
      filterLoading: false,
      filterError: null,
      activeTab: 0,
    }),
}));

export default useRealtimeStore;
