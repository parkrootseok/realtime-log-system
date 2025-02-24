export const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  UNKNOWN: 'UNKNOWN',
};

export const LOG_LEVEL_STYLES = {
  ERROR: {
    background: '#fee2e2',
    color: '#dc2626',
    dotColor: '#dc2626',
  },
  WARN: {
    background: '#fef3c7',
    color: '#d97706',
    dotColor: '#f59e0b',
  },
  INFO: {
    background: '#dbeafe',
    color: '#2563eb',
    dotColor: '#3b82f6',
  },
  DEFAULT: {
    background: '#f3f4f6',
    color: '#4b5563',
    dotColor: '#9ca3af',
  },
};

export const DEFAULT_LOG_LEVELS = [LOG_LEVELS.ERROR, LOG_LEVELS.WARN, LOG_LEVELS.INFO]; 