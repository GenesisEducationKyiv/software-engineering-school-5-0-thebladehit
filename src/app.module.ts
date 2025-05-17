import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { MailModule } from './modules/mail/mail.module';
import { WeatherModule } from './modules/weather/weather.module';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';

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
    ScheduleModule.forRoot(),
    SubscriptionsModule,
    MailModule,
    WeatherModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
