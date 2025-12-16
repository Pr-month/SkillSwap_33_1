import { format, transports, createLogger } from 'winston';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const LOGS_DIR = join(process.cwd(), 'logs');

function ensureLogsDir() {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
    console.log(`[logger] Created logs directory at: ${LOGS_DIR}`);
  }
}

ensureLogsDir();

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new transports.File({
      filename: join(LOGS_DIR, 'combined.log'),
      level: 'info',
    }),
    new transports.File({
      filename: join(LOGS_DIR, 'error.log'),
      level: 'error',
    }),
    new transports.Console({
      format: combine(colorize(), logFormat),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
  ],
  exitOnError: false,
});

export default logger;
