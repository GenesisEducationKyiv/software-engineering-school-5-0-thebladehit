import { join } from 'path';

import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common/proto/notifications';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { AbstractNotificationsService } from './abstracts/notifications.abstract';
import { NotificationsGrpcService } from './notifications.grpc-service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_PACKAGE_NAME,
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get('NOTIFICATIONS_GRPC_URL'),
            package: NOTIFICATIONS_PACKAGE_NAME,
            protoPath: join(
              __dirname,
              '..',
              '..',
              'libs/common/src/proto/notifications.proto'
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: AbstractNotificationsService,
      useClass: NotificationsGrpcService,
    },
  ],
  exports: [AbstractNotificationsService],
})
export class NotificationsModule {}
