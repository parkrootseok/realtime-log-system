import { create } from 'zustand';

const useDistributionStore = create((set) => ({
  distributionSocket: null,
  realtimeDistribution: [],
  initDistributionSocket: (url) => {
    const socket = new WebSocket(url);
    set({ distributionSocket: socket });
    return socket;
  },
  setRealtimeDistribution: (data) => set({ realtimeDistribution: data }),
}));

export default useDistributionStore;
