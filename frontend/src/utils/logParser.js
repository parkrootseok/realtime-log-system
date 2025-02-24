const LOG_PATTERN = /^(\S+ \S+) (\w+)\s+\[([^\]]+)\] - \[([^\]]+)\] - (.+)$/;

/**
 * 로그 문자열을 파싱하여 구조화된 객체로 변환합니다.
 * @param {string} logString - 파싱할 로그 문자열
 * @returns {LogEntry} 파싱된 로그 객체
 *
 * @typedef {Object} LogEntry
 * @property {string} timestamp - 로그 발생 시간
 * @property {('ERROR'|'WARN'|'INFO'|'UNKNOWN')} level - 로그 레벨
 * @property {string} logger - 로거 이름
 * @property {string} service - 서비스 이름
 * @property {string} message - 로그 메시지
 *
 * @example
 * // 입력: "2025-02-24 15:55:58 INFO  [c.h.b.d.l.s.LogGeneratorService] - [InventoryService] - User login successful: user537"
 * // 출력: {
 * //   timestamp: "2025-02-24 15:55:58",
 * //   level: "INFO",
 * //   logger: "c.h.b.d.l.s.LogGeneratorService",
 * //   service: "InventoryService",
 * //   message: "User login successful: user537"
 * // }
 */
export const parseLogString = (logString) => {
  try {
    const cleanedLog = logString.trim();

    const regex =
      /^(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\s+(ERROR|WARN|INFO)\s+\[.*?\]\s+-\s+\[(.*?)\]\s+-\s+(.+)$/;
    const matches = cleanedLog.match(regex);

    if (!matches) {
      return {
        timestamp: new Date().toLocaleString(),
        level: 'ERROR',
        service: 'UNKNOWN',
        message: cleanedLog,
        raw: cleanedLog,
      };
    }

    const [, timestamp, level, service, message] = matches;

    return {
      timestamp: timestamp,
      level: level.trim(),
      service: service.trim(),
      message: message.trim(),
      raw: cleanedLog,
    };
  } catch (error) {
    return {
      timestamp: new Date().toLocaleString(),
      level: 'ERROR',
      service: 'ERROR',
      message: '로그 파싱 중 에러 발생',
      raw: logString,
    };
  }
};

/**
 * 로그 레벨이 유효한지 검사합니다.
 * @param {string} level - 검사할 로그 레벨
 * @returns {boolean} 유효성 여부
 */
export const isValidLogLevel = (level) => {
  return ['ERROR', 'WARN', 'INFO'].includes(level?.toUpperCase());
};

/**
 * 로그 객체 배열을 레벨별로 필터링합니다.
 * @param {LogEntry[]} logs - 필터링할 로그 배열
 * @param {string[]} levels - 포함할 로그 레벨 배열
 * @returns {LogEntry[]} 필터링된 로그 배열
 */
export const filterLogsByLevel = (logs, levels) => {
  if (!Array.isArray(logs) || !Array.isArray(levels) || levels.length === 0) {
    return [];
  }

  const upperLevels = levels.map((level) => level.toUpperCase());
  return logs.filter((log) => upperLevels.includes(log.level?.toUpperCase()));
};
