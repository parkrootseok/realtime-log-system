export const parseLogString = (logStr) => {
  const match = logStr.match(/^(\S+\s+\S+)\s+(\w+)\s+\[(.*?)\]\s*-\s*(.*)$/);
  if (match) {
    return {
      timestamp: match[1],
      level: match[2],
      service: match[3],
      message: match[4].trim(),
    };
  }
  return null;
};
