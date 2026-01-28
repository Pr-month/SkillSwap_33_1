"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const fs_1 = require("fs");
const path_1 = require("path");
const LOGS_DIR = (0, path_1.join)(process.cwd(), 'logs');
function ensureLogsDir() {
    if (!(0, fs_1.existsSync)(LOGS_DIR)) {
        (0, fs_1.mkdirSync)(LOGS_DIR, { recursive: true });
        console.log(`[logger] Created logs directory at: ${LOGS_DIR}`);
    }
}
ensureLogsDir();
const { combine, timestamp, printf, colorize, errors } = winston_1.format;
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${String(timestamp)} [${String(level).toUpperCase()}]: ${String(stack || message)}`;
});
const logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston_1.transports.File({
            filename: (0, path_1.join)(LOGS_DIR, 'combined.log'),
            level: 'info',
        }),
        new winston_1.transports.File({
            filename: (0, path_1.join)(LOGS_DIR, 'error.log'),
            level: 'error',
        }),
        new winston_1.transports.Console({
            format: combine(colorize(), logFormat),
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map