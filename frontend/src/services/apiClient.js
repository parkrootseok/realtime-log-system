import axios from 'axios';
import { API_CONFIG } from '../constants/config';
import { ApiError } from './apiError';

/**
 * API 요청을 위한 axios 인스턴스를 생성합니다.
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API 응답을 처리하는 함수입니다.
 * @param {Promise} apiCall - API 호출 Promise
 * @returns {Promise<ApiResponse>} 처리된 응답
 * @throws {ApiError} API 호출 실패 시 발생하는 에러
 */
const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall;
    return response;
  } catch (error) {
    if (error.response) {
      throw new ApiError(
        error.response.data.message || '서버 에러가 발생했습니다.',
        error.response.status,
        error.response.data
      );
    }
    if (error.request) {
      throw new ApiError('서버에 연결할 수 없습니다.', 0);
    }
    throw new ApiError('요청을 보낼 수 없습니다.', 0);
  }
};

export { apiClient, handleApiResponse };
