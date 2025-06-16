import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscriptionType } from '@prisma/client';

import { AbstractMailService } from '../../../src/modules/mail/abstracts/mail.service.abstract';
import { SendConfirmationMailDto } from '../../../src/modules/mail/dto/send-confirmation-mail.dto';
import { SendDailyForecastMailDto } from '../../../src/modules/mail/dto/send-daily-forecast-mail.dto';
import { SendHourlyForecastMailDto } from '../../../src/modules/mail/dto/send-hourly-forecast-mail.dto';
import { MailService } from '../../../src/modules/mail/mail.serviceImpl';

const fakeAPIUrl = 'http://fake-api.com';

describe('MailServiceImpl', () => {
  let service: AbstractMailService;

  const mockedMailerService = {
    sendMail: jest.fn(),
  };

  const mockedConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'BACK_BASE_URL') return fakeAPIUrl;
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AbstractMailService,
          useClass: MailService,
        },
        {
          provide: MailerService,
          useValue: mockedMailerService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    service = module.get(AbstractMailService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSubscriptionConfirmation', () => {
    it('should send confirmation email with correct context', async () => {
      const dto: SendConfirmationMailDto = {
        email: 'test@example.com',
        token: 'abc123',
        city: 'Kyiv',
        frequency: SubscriptionType.DAILY,
      };

      await service.sendSubscriptionConfirmation(dto);

      expect(mockedMailerService.sendMail).toHaveBeenCalledWith({
        to: dto.email,
        subject: 'Your subscription is created! Confirm it',
        template: './confirmation',
        context: {
          city: dto.city,
          frequency: dto.frequency,
          urlConfirm: `${fakeAPIUrl}/api/confirm/abc123`,
          urlUnsubscribe: `${fakeAPIUrl}/api/unsubscribe/abc123`,
        },
      });
    });
  });

  describe('sendDailyForecast', () => {
    it('should send daily forecast email with correct context', async () => {
      const dto: SendDailyForecastMailDto = {
        email: 'user@example.com',
        city: 'Lviv',
        maxTemp: 30,
        minTemp: 18,
        avgTemp: 24,
        avgHumidity: 60,
        chanceOfRain: 20,
        description: 'Sunny',
        sunrise: '6:00 AM',
        sunset: '8:00 PM',
      };

      await service.sendDailyForecast(dto);

      expect(mockedMailerService.sendMail).toHaveBeenCalledWith({
        to: dto.email,
        subject: `Daily Forecast for ${dto.city}`,
        template: './daily-forecast',
        context: dto,
      });
    });
  });

  describe('sendHourlyForecast', () => {
    it('should send hourly forecast email with correct context', async () => {
      const dto: SendHourlyForecastMailDto = {
        email: 'example@test.com',
        city: 'Odesa',
        temp: 22,
        feelsLikeTemp: 20,
        humidity: 55,
        chance_of_rain: 10,
        description: 'Partly cloudy',
      };

      await service.sendHourlyForecast(dto);

      expect(mockedMailerService.sendMail).toHaveBeenCalledWith({
        to: dto.email,
        subject: `Hourly Forecast for ${dto.city}`,
        template: './hourly-forecast',
        context: dto,
      });
    });
  });
});
