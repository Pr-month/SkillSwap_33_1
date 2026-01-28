"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const getDataSourceOptions = () => ({
    type: 'postgres',
    applicationName: 'skillswap',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'skillswap',
    synchronize: process.env.NODE_ENV !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
exports.dbConfig = (0, config_1.registerAs)('DB_CONFIG', getDataSourceOptions);
exports.default = new typeorm_1.DataSource(getDataSourceOptions());
//# sourceMappingURL=db.config.js.map