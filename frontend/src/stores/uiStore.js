import { create } from 'zustand';

const useUIStore = create((set) => ({
  // UI 상태
  activeTab: 'realtime',

  // 액션
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 초기화
  resetUIState: () =>
    set({
      activeTab: 'realtime',
    }),
}));

export default useUIStore;
