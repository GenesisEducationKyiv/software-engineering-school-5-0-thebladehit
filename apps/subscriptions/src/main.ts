import { winstonConfig } from '@app/common/logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SubscriptionsModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  await app.listen(configService.get('PORT') ?? 3000);
}

bootstrap();
