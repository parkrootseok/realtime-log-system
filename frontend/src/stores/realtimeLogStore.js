import { create } from 'zustand';

const useRealtimeLogStore = create((set) => ({
  logSocket: null,
  realtimeLogs: [],
  initLogSocket: (url) => {
    const socket = new WebSocket(url);
    set({ logSocket: socket });
    return socket;
  },
  addRealtimeLog: (log) =>
    set((state) => ({
      realtimeLogs: [...state.realtimeLogs, log],
    })),
}));

export default useRealtimeLogStore;
