"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const config_1 = require("@nestjs/config");
exports.appConfig = (0, config_1.registerAs)('APP_CONFIG', () => ({
    port: Number(process.env.PORT) || 3000,
    environment: process.env.NODE_ENV || 'development',
    hashSalt: process.env.HASH_SALT || 10,
}));
//# sourceMappingURL=app.config.js.map