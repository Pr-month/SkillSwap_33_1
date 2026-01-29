"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_config_1 = require("../../config/jwt.config");
const jwt_1 = require("@nestjs/jwt");
let WsJwtGuard = class WsJwtGuard {
    jwtService;
    jwtConfig;
    constructor(jwtService, jwtConfig) {
        this.jwtService = jwtService;
        this.jwtConfig = jwtConfig;
    }
    async verify(client) {
        const token = this.extractToken(client);
        if (!token)
            throw new common_1.UnauthorizedException('Token not provided');
        const { sub, email, role } = await this.jwtService.verifyAsync(token, { secret: this.jwtConfig.secret });
        client.data.user = { sub, email, role };
        return client;
    }
    extractToken(client) {
        const authHeader = client.handshake.headers.authorization;
        if (!authHeader)
            return null;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
};
exports.WsJwtGuard = WsJwtGuard;
exports.WsJwtGuard = WsJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(jwt_config_1.jwtConfig.KEY)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], WsJwtGuard);
//# sourceMappingURL=ws.guard.js.map