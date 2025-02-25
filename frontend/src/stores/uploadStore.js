import { create } from 'zustand';

const initialState = {
  processedFile: null,
  fileName: null,
  uploadedFile: null,
  uploadSuccess: false,
  uploadError: null,
  isUploading: false,
  logs: [],
  stats: { totalCount: 0, errorCount: 0 },
  selectedLevels: ['ERROR', 'WARN', 'INFO'],
  filteredLogs: [],
  filterLoading: false,
  filterError: null,
};

const useUploadStore = create((set) => ({
  ...initialState,

  // 액션
  setUploadedFile: (file) =>
    set({
      uploadedFile: file,
      // 새 파일이 업로드되면 관련 상태도 초기화
      processedFile: null,
      fileName: null,
      uploadSuccess: false,
      uploadError: null,
      filterError: null,
      filteredLogs: [],
      stats: { totalCount: 0, errorCount: 0 },
      selectedLevels: ['ERROR', 'WARN', 'INFO'],
    }),

  setUploadSuccess: (success) =>
    set({
      uploadSuccess: success,
      uploadError: success ? null : undefined,
    }),

  setUploadError: (error) =>
    set({
      uploadError: error,
      uploadSuccess: false,
    }),

  initializeUpload: (file) =>
    set({
      processedFile: file,
      fileName: null,
      filteredLogs: [],
      stats: { totalCount: 0, errorCount: 0 },
      uploadSuccess: false,
      uploadError: null,
      filterError: null,
      isUploading: true,
    }),

  updateUploadSuccess: ({ fileName, stats, logs }) =>
    set({
      fileName,
      stats,
      filteredLogs: logs,
      uploadSuccess: true,
      uploadError: null,
      isUploading: false,
    }),

  updateUploadError: (error) =>
    set({
      uploadError: error,
      filteredLogs: [],
      uploadSuccess: false,
      isUploading: false,
    }),

  updateFilterState: ({ logs, error }) =>
    set((state) => ({
      filteredLogs: error ? [] : logs,
      filterError: error,
      filterLoading: false,
    })),

  setSelectedLevels: (levels) => set({ selectedLevels: levels }),
  setFilterLoading: (loading) => set({ filterLoading: loading }),

  // 초기화
  resetUploadState: () => set(initialState),
}));

export default useUploadStore;
