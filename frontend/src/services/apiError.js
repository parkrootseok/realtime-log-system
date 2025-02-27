/**
 * API 에러를 처리하는 클래스입니다.
 * @extends Error
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
