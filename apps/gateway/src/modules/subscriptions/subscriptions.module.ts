import { join } from 'path';

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { SUBSCRIPTIONS_PACKAGE_NAME } from '@app/common/proto/subscriptions';

import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: SUBSCRIPTIONS_PACKAGE_NAME,
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get('SUBSCRIPTIONS_GRPC_URL'),
            package: SUBSCRIPTIONS_PACKAGE_NAME,
            protoPath: join(
              __dirname,
              '..',
              '..',
              'libs/common/src/proto/subscriptions.proto'
            ),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
