import { Test, TestingModule } from '@nestjs/testing';

import { AbstractMailService } from '../../../src/modules/mail/abstracts/mail.service.abstract';
import { WeatherNotification } from '../../../src/modules/notifier/weather-notification.service';
import { SubscriptionsService } from '../../../src/modules/subscriptions/subscriptions.service';
import { SubscriptionWithUserAndCity } from '../../../src/modules/subscriptions/types/subscription-with-user-city';
import { WeatherService } from '../../../src/modules/weather/weather.service';

describe('WeatherNotificationService', () => {
  let service: WeatherNotification;

  const mockedWeatherService = {
    getDailyForecast: jest.fn(),
    getHourlyForecast: jest.fn(),
  };

  const mockedSubscriptionService = {
    getDailySubscribers: jest.fn(),
    getHourlySubscribers: jest.fn(),
    deleteSubscription: jest.fn(),
  };

  const mockedMailService = {
    sendDailyForecast: jest.fn(),
    sendHourlyForecast: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherNotification,
        {
          provide: WeatherService,
          useValue: mockedWeatherService,
        },
        {
          provide: SubscriptionsService,
          useValue: mockedSubscriptionService,
        },
        {
          provide: AbstractMailService,
          useValue: mockedMailService,
        },
      ],
    }).compile();

    service = module.get(WeatherNotification);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notifyDailySubscribers', () => {
    it('should send daily forecasts to subscribers', async () => {
      const subscribers = [
        { id: '1', city: 'Kyiv', user: { email: 'a@a.com' } },
        { id: '2', city: 'Kyiv', user: { email: 'b@b.com' } },
      ];
      const forecast = {
        maxTemp: 20,
        minTemp: 10,
        avgTemp: 15,
        avgHumidity: 50,
        chanceOfRain: 30,
        description: 'Sunny',
        sunrise: '6:00 AM',
        sunset: '8:00 PM',
      };

      mockedSubscriptionService.getDailySubscribers.mockResolvedValue(
        subscribers as unknown as SubscriptionWithUserAndCity[]
      );
      mockedWeatherService.getDailyForecast.mockResolvedValue(forecast);
      mockedMailService.sendDailyForecast.mockResolvedValue(undefined);

      await service.notifyDailySubscribers();

      expect(mockedMailService.sendDailyForecast).toHaveBeenCalledTimes(
        subscribers.length
      );
      expect(mockedWeatherService.getDailyForecast).toHaveBeenCalledTimes(
        subscribers.length
      );
    });
  });

  describe('notifyHourlySubscribers', () => {
    it('should send hourly forecasts to subscribers', async () => {
      const subscribers = [
        { id: '1', city: { name: 'Lviv' }, user: { email: 'lviv@ukr.net' } },
      ];
      const forecast = {
        temp: 17,
        description: 'Cloudy',
        feelsLikeTemp: 16,
        humidity: 60,
        chance_of_rain: 40,
      };

      mockedSubscriptionService.getHourlySubscribers.mockResolvedValue(
        subscribers as unknown as SubscriptionWithUserAndCity[]
      );
      mockedWeatherService.getHourlyForecast.mockResolvedValue(forecast);
      mockedMailService.sendHourlyForecast.mockResolvedValue(undefined);

      await service.notifyHourlySubscribers();

      expect(
        mockedSubscriptionService.getHourlySubscribers
      ).toHaveBeenCalledTimes(subscribers.length);
      expect(mockedWeatherService.getHourlyForecast).toHaveBeenCalledTimes(
        subscribers.length
      );
      expect(mockedMailService.sendHourlyForecast).toHaveBeenCalledWith({
        email: 'lviv@ukr.net',
        city: 'Lviv',
        ...forecast,
      });
    });
  });
});
