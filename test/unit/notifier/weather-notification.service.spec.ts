import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AbstractNotificationsService } from '../../../apps/subscriptions/src/modules/notifications/abstracts/notifications.abstract';
import { WeatherNotification } from '../../../apps/subscriptions/src/modules/notifier/weather-notification.service';
import { SubscriptionsService } from '../../../apps/subscriptions/src/modules/subscriptions/subscriptions.service';
import { SubscriptionWithUserAndCity } from '../../../apps/subscriptions/src/modules/subscriptions/types/subscription-with-user-city';
import { AbstractWeatherService } from '../../../apps/subscriptions/src/modules/weather/abstracts/weather.abstract';

describe('WeatherNotificationService', () => {
  let service: WeatherNotification;

  const mockedWeatherService = {
    getDailyForecasts: jest.fn(),
    getHourlyForecasts: jest.fn(),
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

  const mockedConfigService = {
    get: jest.fn().mockReturnValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherNotification,
        {
          provide: AbstractWeatherService,
          useValue: mockedWeatherService,
        },
        {
          provide: SubscriptionsService,
          useValue: mockedSubscriptionService,
        },
        {
          provide: AbstractNotificationsService,
          useValue: mockedMailService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    service = module.get(WeatherNotification);
    jest.clearAllMocks();
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

      mockedSubscriptionService.getDailySubscribers.mockResolvedValueOnce(
        subscribers as unknown as SubscriptionWithUserAndCity[]
      );
      mockedWeatherService.getDailyForecasts.mockResolvedValue(forecast);
      mockedMailService.sendDailyForecast.mockResolvedValue(undefined);

      await service.notifyDailySubscribers();

      expect(mockedMailService.sendDailyForecast).toHaveBeenCalledTimes(
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
        chanceOfRain: 40,
      };

      mockedSubscriptionService.getHourlySubscribers.mockResolvedValueOnce(
        subscribers as unknown as SubscriptionWithUserAndCity[]
      );
      mockedWeatherService.getHourlyForecasts.mockResolvedValue(forecast);
      mockedMailService.sendHourlyForecast.mockResolvedValue(undefined);

      await service.notifyHourlySubscribers();

      expect(mockedMailService.sendHourlyForecast).toHaveBeenCalledTimes(
        subscribers.length
      );
    });
  });
});
