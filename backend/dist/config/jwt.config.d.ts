import { JwtSignOptions } from '@nestjs/jwt';
export declare const jwtConfig: (() => {
    secret: string;
    expiresIn: JwtSignOptions["expiresIn"];
    refreshSecret: string;
    refreshExpiresIn: JwtSignOptions["expiresIn"];
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    expiresIn: JwtSignOptions["expiresIn"];
    refreshSecret: string;
    refreshExpiresIn: JwtSignOptions["expiresIn"];
}>;
