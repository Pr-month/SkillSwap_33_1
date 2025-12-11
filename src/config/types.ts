import { ConfigType } from '@nestjs/config';

import { dbConfig } from './db.config';
import { appConfig } from './app.config';

export type AppConfig = ConfigType<typeof appConfig>;
export type DbConfig = ConfigType<typeof dbConfig>;
