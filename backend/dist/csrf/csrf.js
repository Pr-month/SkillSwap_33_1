"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCsrfToken = exports.doubleCsrfProtection = void 0;
const csrf_csrf_1 = require("csrf-csrf");
const options = {
    getSecret: () => process.env.CSRF_SECRET || 'super-secret-key-at-least-32-chars',
    cookieName: 'x-csrf-token',
    cookieOptions: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    },
    getSessionIdentifier: (req) => {
        const requestWithUser = req;
        const userId = requestWithUser.user?.id;
        return typeof userId === 'string' || typeof userId === 'number'
            ? String(userId)
            : '';
    },
    getCsrfTokenFromRequest: (req) => {
        const header = req.headers['x-csrf-token'];
        return typeof header === 'string' ? header : '';
    },
};
const csrfUtils = (0, csrf_csrf_1.doubleCsrf)(options);
exports.doubleCsrfProtection = csrfUtils.doubleCsrfProtection;
exports.generateCsrfToken = csrfUtils.generateCsrfToken;
//# sourceMappingURL=csrf.js.map