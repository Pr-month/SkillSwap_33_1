import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';
import { Request } from 'express';

const options: DoubleCsrfConfigOptions = {
  getSecret: () =>
    process.env.CSRF_SECRET || 'super-secret-key-at-least-32-chars',
  cookieName: 'x-csrf-token',
  cookieOptions: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
  getSessionIdentifier: (req: Request): string => {
    const requestWithUser = req as unknown as {
      user?: { id?: string | number };
    };

    const userId = requestWithUser.user?.id;

    return typeof userId === 'string' || typeof userId === 'number'
      ? String(userId)
      : '';
  },
  getCsrfTokenFromRequest: (req: Request): string => {
    const header = req.headers['x-csrf-token'];
    return typeof header === 'string' ? header : '';
  },
};

const csrfUtils = doubleCsrf(options);

export const doubleCsrfProtection = csrfUtils.doubleCsrfProtection;
export const generateCsrfToken = csrfUtils.generateCsrfToken;
