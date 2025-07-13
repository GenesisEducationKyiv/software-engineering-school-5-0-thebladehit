import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { HealthModule } from '@app/common/health';

import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SUBSCRIPTION_URL: Joi.string().required(),
        WEATHER_URL: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    SubscriptionsModule,
    WeatherModule,
    HealthModule,
  ],
})
export class GatewayModule {}
