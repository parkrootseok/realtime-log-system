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
  timeUnit: 'day',
  page: 0,
  pageSize: 20,
  totalPages: 0,
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
      stats: null,
      selectedLevels: ['ERROR', 'WARN', 'INFO'],
      page: 0,
      totalPages: 0,
      logs: [],
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
      logs,
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

  updateFilterState: ({ logs, error, totalElements }) =>
    set((state) => ({
      filteredLogs: error ? [] : logs,
      filterError: error,
      filterLoading: false,
      totalPages: totalElements ? Math.ceil(totalElements / state.pageSize) : state.totalPages,
    })),

  setSelectedLevels: (levels) => set({ selectedLevels: levels }),
  setFilterLoading: (loading) => set({ filterLoading: loading }),

  // 초기화
  resetUploadState: () => set(initialState),

  // stats 초기화 함수 추가
  resetStats: () => set({ stats: null }), // 또는 초기 stats 객체로 설정

  // 로그 데이터 저장
  setLogs: (logs) => set({ logs }),

  // 시간 단위 저장
  setTimeUnit: (timeUnit) => set({ timeUnit }),

  setStats: (stats) => set({ stats }),

  reset: () => set({ uploadedFile: null, stats: null, logs: [] }),

  // 페이지네이션 관련 액션 추가
  setPage: (page) => set({ page }),
  setTotalPages: (totalPages) => set({ totalPages }),
  resetPagination: () => set({ page: 0, totalPages: 0 }),
}));

export default useUploadStore;
