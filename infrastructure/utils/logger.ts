type LogLevel = "log" | "debug" | "info" | "warn" | "error";

const levelConfig: Record<LogLevel, { emoji: string; color: string }> = {
  log: { emoji: "📝", color: "\x1b[37m" }, // White
  debug: { emoji: "🐞", color: "\x1b[36m" }, // Cyan
  info: { emoji: "ℹ️", color: "\x1b[34m" }, // Blue
  warn: { emoji: "⚠️", color: "\x1b[33m" }, // Yellow
  error: { emoji: "❌", color: "\x1b[31m" }, // Red
};

const resetColor = "\x1b[0m";

type LoggerFunction = (...args: unknown[]) => void;

interface Logger {
  log: LoggerFunction;
  debug: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
}

function createLogger(): Logger {
  const logger = {} as Logger;

  (Object.keys(levelConfig) as LogLevel[]).forEach((level) => {
    logger[level] = (...args: unknown[]) => {
      const { emoji, color } = levelConfig[level];
      const prefix = `${color}${emoji} [${level.toUpperCase()}]${resetColor}`;
      // Use the corresponding console method
      (console[level] || console.log)(prefix, ...args);
    };
  });

  return logger;
}

const logger = createLogger();

export { logger };
