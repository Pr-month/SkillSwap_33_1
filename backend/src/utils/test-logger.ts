import logger from './logger';

console.log('Запуск теста логгера...');

logger.error('Это ОШИБКА', new Error('Пример ошибки'));
logger.warn('Это предупреждение');
logger.info('Это информационное сообщение');
logger.debug('Это отладочное сообщение (может не отобразиться)');

console.log('Тест завершён. Проверьте папку `logs/`.');
