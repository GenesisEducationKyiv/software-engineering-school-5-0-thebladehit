import { createWinstonConfig } from '@app/common/logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { NotificationModule } from './notification.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(NotificationModule, {
    logger: WinstonModule.createLogger(createWinstonConfig('Notifications')),
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 3012);
}

bootstrap();
