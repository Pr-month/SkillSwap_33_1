"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const db_config_1 = require("./config/db.config");
const app_config_1 = require("./config/app.config");
const jwt_config_1 = require("./config/jwt.config");
const env_validation_1 = require("./config/env.validation");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const skills_module_1 = require("./skills/skills.module");
const files_module_1 = require("./files/files.module");
const csrf_controller_1 = require("./csrf/csrf.controller");
const requests_module_1 = require("./requests/requests.module");
const categories_module_1 = require("./categories/categories.module");
const cities_module_1 = require("./cities/cities.module");
const websocket_module_1 = require("./websocket/websocket.module");
const glossaries_module_1 = require("./glossaries/glossaries.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            skills_module_1.SkillsModule,
            categories_module_1.CategoriesModule,
            cities_module_1.CitiesModule,
            glossaries_module_1.GlossariesModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.appConfig, jwt_config_1.jwtConfig, db_config_1.dbConfig],
                validationSchema: env_validation_1.envValidationSchema,
                validationOptions: {
                    abortEarly: false,
                    allowUnknown: true,
                },
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [db_config_1.dbConfig.KEY],
                useFactory: (cfg) => cfg,
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                inject: [jwt_config_1.jwtConfig.KEY],
                useFactory: (cfg) => ({
                    secret: cfg.secret,
                    signOptions: { expiresIn: cfg.expiresIn },
                }),
            }),
            files_module_1.FilesModule,
            requests_module_1.RequestsModule,
            websocket_module_1.WebSocketModule,
        ],
        controllers: [app_controller_1.AppController, csrf_controller_1.CsrfController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map