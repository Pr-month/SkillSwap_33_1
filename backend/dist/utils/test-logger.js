"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
console.log('Запуск теста логгера...');
logger_1.default.error('Это ОШИБКА', new Error('Пример ошибки'));
logger_1.default.warn('Это предупреждение');
logger_1.default.info('Это информационное сообщение');
logger_1.default.debug('Это отладочное сообщение (может не отобразиться)');
console.log('Тест завершён. Проверьте папку `logs/`.');
//# sourceMappingURL=test-logger.js.map