import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'client'),
      serveRoot: '/',
    }),
    SubscriptionsModule,
    WeatherModule,
    HealthModule,
  ],
})
export class GatewayModule {}
