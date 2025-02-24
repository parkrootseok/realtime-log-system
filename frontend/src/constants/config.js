export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_LOGS_DISPLAY: 20,
};

export const TABLE_CONFIG = {
  GRID_TEMPLATE: '200px 100px 200px 1fr',
  MAX_HEIGHT: '600px',
};
