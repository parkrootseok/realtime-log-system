import { apiClient, handleApiResponse } from './apiClient';
import { ApiError } from './apiError';
import { API_CONFIG } from '../constants/config';

/**
 * 로그 관련 API 서비스
 */
class LogService {
  /**
   * 로그 파일을 업로드합니다.
   * @param {File} file - 업로드할 로그 파일
   * @returns {Promise<ApiResponse>} 업로드 결과
   * @throws {ApiError} 파일 크기가 제한을 초과하거나 업로드 실패 시
   */
  async uploadLogs(file) {
    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      throw new ApiError('파일 크기는 10MB를 초과할 수 없습니다.', 400);
    }

    const formData = new FormData();
    formData.append('file', file);

    return handleApiResponse(
      apiClient.post('/logs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  /**
   * 로그를 분석합니다.
   * @param {string} [fileName] - 분석할 로그 파일명 (선택)
   * @param {string} [levels] - 분석할 로그 레벨 (선택)
   * @returns {Promise<{
   *   totalLines: number,
   *   errorCount: number
   * }>} 분석 결과
   */
  async analyzeLogs(fileName = '', levels = '') {
    const params = {};
    if (fileName) params.fileName = fileName;
    if (levels) params.levels = levels;

    const response = await handleApiResponse(apiClient.get('/logs/analyze', { params }));

    return {
      totalLines: response.data.data.totalLogsCount,
      infoCount: response.data.data.infoLogsCount,
      errorCount: response.data.data.errorLogsCount,
      warnCount: response.data.data.warningLogsCount,
    };
  }

  /**
   * 에러 로그를 조회합니다.
   * @param {string} [fileName] - 조회할 로그 파일명 (선택)
   * @param {string[]} [levels] - 조회할 로그 레벨
   * @param {number} [page=0] - 페이지 번호
   * @param {number} [size=20] - 페이지 크기
   * @returns {Promise<ApiResponse>} 조회 결과
   */
  async getErrorLogs(fileName = null, levels = ['ERROR', 'WARN', 'INFO'], page = 0, size = 20) {
    const params = {
      page,
      size,
    };

    if (fileName) {
      params.fileName = fileName;
    }
    if (levels && levels.length > 0) {
      params.levels = levels.join(',');
    }

    return handleApiResponse(apiClient.get('/logs/errors', { params }));
  }

  /**
   * SSE 연결을 생성합니다.
   * @returns {EventSource} SSE 연결 객체
   */
  createLogStream() {
    return new EventSource(`${API_CONFIG.BASE_URL}/logs/stream`);
  }
}

export const logService = new LogService();
