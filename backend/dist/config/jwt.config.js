"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const config_1 = require("@nestjs/config");
exports.jwtConfig = (0, config_1.registerAs)('JWT_CONFIG', () => {
    return {
        secret: process.env.JWT_SECRET || 'jwtsecret',
        expiresIn: (process.env.JWT_EXPIRES_IN ||
            '1h'),
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
            '7d'),
    };
});
//# sourceMappingURL=jwt.config.js.map