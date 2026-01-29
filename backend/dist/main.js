"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csrf_1 = require("./csrf/csrf");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const all_exception_filter_1 = require("./common/all-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const appConfig = configService.get('APP_CONFIG');
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    });
    app.use((req, res, next) => {
        if (req.path === '/api' ||
            req.path.startsWith('/api/docs') ||
            req.path.startsWith('/api-json')) {
            return next();
        }
        (0, csrf_1.doubleCsrfProtection)(req, res, next);
    });
    app.use(csrf_1.doubleCsrfProtection);
    app.use((req, res, next) => {
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
            if (req.csrfToken && typeof req.csrfToken === 'function') {
                res.setHeader('X-CSRF-Token', req.csrfToken());
            }
        }
        next();
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionFilter());
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SkillSwap API')
        .setDescription(`
    API для проекта SkillSwap.
    
    ## CSRF Защита:
    1. Сначала получите CSRF токен через GET /csrf
    2. Отправляйте его в заголовке X-CSRF-Token для всех не-GET запросов
    3. Куки будут отправляться автоматически (нужен credentials: 'include' на фронтенде)
  `)
        .setVersion('1.0')
        .addBearerAuth()
        .addApiKey({
        type: 'apiKey',
        name: 'X-CSRF-Token',
        in: 'header',
        description: 'CSRF токен для защиты от межсайтовых запросов',
    }, 'csrf-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    swagger_1.SwaggerModule.setup('api', app, document, {
        jsonDocumentUrl: 'api-json',
    });
    await app.listen(appConfig?.port ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map