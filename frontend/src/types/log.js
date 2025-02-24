/**
 * @typedef {Object} LogEntry
 * @property {string} timestamp - 로그 발생 시간
 * @property {('ERROR'|'WARN'|'INFO'|'UNKNOWN')} level - 로그 레벨
 * @property {string} logger - 로거 이름
 * @property {string} service - 서비스 이름
 * @property {string} message - 로그 메시지
 */

/**
 * @typedef {Object} LogStats
 * @property {number} totalCount - 전체 로그 수
 * @property {number} errorCount - 에러 로그 수
 */ 