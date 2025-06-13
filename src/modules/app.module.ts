import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from '../jobs/jobs.module';
import { MailModule } from './mail/mail.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        SMTP_HOST: Joi.string().required(),
        SMTP_USERNAME: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        BACK_BASE_URL: Joi.string().required(),
        WEATHER_API_KEY: Joi.string().required(),
        WEATHER_CACHE_TTL: Joi.number().integer().required(),
        WEATHER_BASE_URL: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'client'),
      serveRoot: '/',
    }),
    ScheduleModule.forRoot(),
    SubscriptionsModule,
    MailModule,
    WeatherModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
