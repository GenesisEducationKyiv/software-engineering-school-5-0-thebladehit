import { SamplingLogger } from '@app/common/logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { NotificationModule } from './notification.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(NotificationModule, {
    logger: new SamplingLogger('Notifications'),
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 3012);
}

bootstrap();
