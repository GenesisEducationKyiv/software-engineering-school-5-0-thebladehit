import { join } from 'path';

import { SamplingLogger } from '@app/common/logger';
import { SUBSCRIPTIONS_PACKAGE_NAME } from '@app/common/proto/subscriptions';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new SamplingLogger('Subscriptions'),
  });
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: SUBSCRIPTIONS_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        '..',
        '..',
        'libs/common/src/proto/subscriptions.proto'
      ),
      url: configService.get('GRPC_URL'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3010);
}

bootstrap();
