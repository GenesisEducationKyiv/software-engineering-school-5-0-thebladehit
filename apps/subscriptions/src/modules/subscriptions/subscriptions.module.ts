import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { CityModule } from '../city/city.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotifierModule } from '../notifier/notifier.module';
import { PrismaModule } from '../prisma/prisma.module';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

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
        PORT: Joi.number().required(),
        BATCH_SIZE: Joi.number().required(),
      }),
    }),
    PrismaModule,
    CityModule,
    NotificationsModule,
    NotifierModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    {
      provide: AbstractSubscriptionRepository,
      useClass: SubscriptionRepository,
    },
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
