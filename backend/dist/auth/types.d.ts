import { UserRole } from './roles.enum';
export type TJwtPayload = {
    sub: string;
    email: string;
    role: UserRole;
};
export type TAuthResponse = {
    user: TJwtPayload;
};
