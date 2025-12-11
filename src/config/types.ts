import { ConfigType } from '@nestjs/config';

import { appConfig } from './app.config';

export type IAppConfig = ConfigType<typeof appConfig>;
