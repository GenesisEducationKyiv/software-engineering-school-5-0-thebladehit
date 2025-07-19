// import { join } from 'path';

import { winstonConfig } from '@app/common/logger';
// import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common/proto/notifications';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';

import { NotificationModule } from './notification.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(NotificationModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const configService = app.get(ConfigService);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: NOTIFICATIONS_PACKAGE_NAME,
  //     protoPath: join(
  //       __dirname,
  //       '..',
  //       '..',
  //       'libs/common/src/proto/notifications.proto'
  //     ),
  //     url: configService.get('GRPC_URL'),
  //   },
  // });
  // await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3012);
}

bootstrap();
