import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SendConfirmationMailDto } from './dto/send-confirmation-mail.dto';
import { SendDailyForecastMailDto } from './dto/send-daily-forecast-mail.dto';
import { SendHourlyForecastMailDto } from './dto/send-hourly-forecast-mail.dto';
import { MailService } from './contracts/mail.service';
import { MailServiceImpl } from './mail.serviceImpl';
import { SubscriptionType } from '@prisma/client';

const fakeAPIUrl = 'http://fake-api.com';

describe('MailServiceImpl', () => {
  let service: MailService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'BACK_BASE_URL') return fakeAPIUrl;
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: MailService, useClass: MailServiceImpl },
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get(MailService);
    mailerService = module.get(MailerService);
    jest.clearAllMocks();
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

      expect(mailerService.sendMail).toHaveBeenCalledWith({
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

      expect(mailerService.sendMail).toHaveBeenCalledWith({
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

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: dto.email,
        subject: `Hourly Forecast for ${dto.city}`,
        template: './hourly-forecast',
        context: dto,
      });
    });
  });
});
