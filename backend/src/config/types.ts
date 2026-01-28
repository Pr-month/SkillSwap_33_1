import { ConfigType } from '@nestjs/config';

import { dbConfig } from './db.config';
import { appConfig } from './app.config';
import { jwtConfig } from './jwt.config';

export type AppConfig = ConfigType<typeof appConfig>;
export type DbConfig = ConfigType<typeof dbConfig>;
export type JwtConfig = ConfigType<typeof jwtConfig>;
