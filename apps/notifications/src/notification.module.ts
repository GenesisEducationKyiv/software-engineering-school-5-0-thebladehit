import { join } from 'path';

import {
  AbstractEventBus,
  DailyForecastEvent,
  Event,
  EventBusModule,
  EventTypes,
  HourlyForecastEvent,
  SubscriptionCreatedEvent,
} from '@app/common/event-bus';
import { HealthModule } from '@app/common/health';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import Joi from 'joi';

import { DailyForecastHandler } from './handlers/daily-forecast.handler';
import { HourlyForecastHandler } from './handlers/hourly-forecast.handler';
import { SubscriptionCreatedHandler } from './handlers/subscription-created.handler';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USERNAME: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        BACK_BASE_URL: Joi.string().required(),
        // GRPC_URL: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('SMTP_USERNAME'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        template: {
          dir: join(__dirname, 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    HealthModule,
    EventBusModule,
  ],
  providers: [
    MailService,
    SubscriptionCreatedHandler,
    DailyForecastHandler,
    HourlyForecastHandler,
  ],
})
export class NotificationModule implements OnModuleInit {
  constructor(
    private readonly eventBus: AbstractEventBus,
    private readonly subscriptionCreatedHandler: SubscriptionCreatedHandler,
    private readonly dailyForecastHandler: DailyForecastHandler,
    private readonly hourlyForecastHandler: HourlyForecastHandler
  ) {}

  async onModuleInit(): Promise<void> {
    await this.eventBus.subscribe(
      EventTypes.SUBSCRIPTION_CREATED,
      async (event: Event): Promise<void> => {
        this.subscriptionCreatedHandler.handle(
          event as SubscriptionCreatedEvent
        );
      }
    );
    await this.eventBus.subscribe(
      EventTypes.DAILY_FORECAST,
      async (event: Event): Promise<void> => {
        this.dailyForecastHandler.handle(event as DailyForecastEvent);
      }
    );
    await this.eventBus.subscribe(
      EventTypes.HOURLY_FORECAST,
      async (event: Event): Promise<void> => {
        this.hourlyForecastHandler.handle(event as HourlyForecastEvent);
      }
    );
  }
}
