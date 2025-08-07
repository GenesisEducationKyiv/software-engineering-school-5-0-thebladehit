import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AbstractEventBus } from '@app/common/event-bus';

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

  const mockedEventBus = {
    publish: jest.fn(),
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
          provide: AbstractEventBus,
          useValue: mockedEventBus,
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
        { id: '1', city: { name: 'Kyiv' }, user: { email: 'a@a.com' } },
        { id: '2', city: { name: 'Kyiv' }, user: { email: 'b@b.com' } },
      ];
      const forecast = {
        Kyiv: {
          maxTemp: 20,
          minTemp: 10,
          avgTemp: 15,
          avgHumidity: 50,
          chanceOfRain: 30,
          description: 'Sunny',
          sunrise: '6:00 AM',
          sunset: '8:00 PM',
        },
      };

      mockedSubscriptionService.getDailySubscribers.mockResolvedValueOnce(
        subscribers as unknown as SubscriptionWithUserAndCity[]
      );
      mockedWeatherService.getDailyForecasts.mockResolvedValue(forecast);

      await service.notifyDailySubscribers();

      expect(mockedEventBus.publish).toHaveBeenCalledTimes(subscribers.length);
    });
  });

  describe('notifyHourlySubscribers', () => {
    it('should send hourly forecasts to subscribers', async () => {
      const subscribers = [
        { id: '1', city: { name: 'Lviv' }, user: { email: 'lviv@ukr.net' } },
      ];
      const forecast = {
        Lviv: {
          temp: 17,
          description: 'Cloudy',
          feelsLikeTemp: 16,
          humidity: 60,
          chanceOfRain: 40,
        },
      };

      mockedSubscriptionService.getHourlySubscribers.mockResolvedValueOnce(
        subscribers as unknown as SubscriptionWithUserAndCity[]
      );
      mockedWeatherService.getHourlyForecasts.mockResolvedValue(forecast);

      await service.notifyHourlySubscribers();

      expect(mockedEventBus.publish).toHaveBeenCalledTimes(subscribers.length);
    });
  });
});
