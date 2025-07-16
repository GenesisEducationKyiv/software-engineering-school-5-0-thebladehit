import { HealthModule } from '@app/common/health';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { NotifierModule } from './modules/notifier/notifier.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        WEATHER_API_KEY: Joi.string().required(),
        WEATHER_API_BASE_URL: Joi.string().required(),
        OPEN_WEATHER_API_KEY: Joi.string().required(),
        OPEN_WEATHER_BASE_URL: Joi.string().required(),
        NOTIFICATIONS_URL: Joi.string().required(),
        WEATHER_URL: Joi.string().required(),
        BATCH_SIZE: Joi.number().required(),
        NOTIFICATIONS_GRPC_URL: Joi.string().required(),
        WEATHER_GRPC_URL: Joi.string().required(),
      }),
    }),
    SubscriptionsModule,
    NotifierModule,
    HealthModule,
  ],
})
export class AppModule {}
