import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';

import { createWinstonConfig } from '@app/common/logger';
import { WEATHER_PACKAGE_NAME } from '@app/common/proto/weather';

import { WeatherModule } from './modules/weather/weather.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(WeatherModule, {
    logger: WinstonModule.createLogger(createWinstonConfig('Weather')),
  });
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: WEATHER_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        '..',
        '..',
        'libs/common/src/proto/weather.proto'
      ),
      url: configService.get('GRPC_URL'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3011);
}

bootstrap();
