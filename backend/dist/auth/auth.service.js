"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const jwt_config_1 = require("../config/jwt.config");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    jwtService;
    jwtConfig;
    usersService;
    constructor(jwtService, jwtConfig, usersService) {
        this.jwtService = jwtService;
        this.jwtConfig = jwtConfig;
        this.usersService = usersService;
    }
    generateTokens(payload) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.jwtConfig.secret,
            expiresIn: this.jwtConfig.expiresIn,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.jwtConfig.refreshSecret,
            expiresIn: this.jwtConfig.refreshExpiresIn,
        });
        return { accessToken, refreshToken };
    }
    async refresh(user) {
        const { accessToken, refreshToken } = this.generateTokens({
            sub: user.sub,
            email: user.email,
            role: user.role,
        });
        await this.usersService.refresh(user.sub, refreshToken);
        return { accessToken, refreshToken };
    }
    async login(loginData) {
        const user = await this.validateUser(loginData.email, loginData.password);
        const { accessToken, refreshToken } = await this.refresh({
            sub: user.sub,
            role: user.role,
            email: user.email,
        });
        return { accessToken, refreshToken };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
    }
    async register(dto) {
        await this.usersService.create({
            email: dto.email,
            password: dto.password,
        });
        return this.login(dto);
    }
    logout(userId) {
        return this.usersService.refresh(userId, null);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(jwt_config_1.jwtConfig.KEY)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object, users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map