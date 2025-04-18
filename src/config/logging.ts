type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogConfig {
  level: LogLevel;
  enabled: boolean;
  persistToServer: boolean;
  maxLogSize: number;
  rotationCount: number;
  serverEndpoint: string;
}

export const logConfig: LogConfig = {
  level: (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info',
  enabled: import.meta.env.VITE_LOGGING_ENABLED !== 'false',
  persistToServer: import.meta.env.VITE_LOG_TO_SERVER !== 'false',
  maxLogSize: 5242880, // 5MB
  rotationCount: 5,
  serverEndpoint: '/api/logs'
};

export const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

export const shouldLog = (messageLevel: LogLevel): boolean => {
  return logLevels[messageLevel] <= logLevels[logConfig.level];
};