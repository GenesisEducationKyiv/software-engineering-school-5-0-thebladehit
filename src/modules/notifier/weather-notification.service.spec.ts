import { Test, TestingModule } from '@nestjs/testing';

import { AbstractMailService } from '../mail/abstracts/mail.service.abstract';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionWithUserAndCity } from '../subscriptions/types/subscription-restult';
import { WeatherService } from '../weather/weather.service';

import { WeatherNotification } from './weather-notification.service';

describe('WeatherNotificationService', () => {
  let service: WeatherNotification;
  let weatherService: WeatherService;
  let subscriptionsService: SubscriptionsService;
  let mailService: AbstractMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherNotification,
        {
          provide: WeatherService,
          useValue: {
            getDailyForecast: jest.fn(),
            getHourlyForecast: jest.fn(),
          },
        },
        {
          provide: SubscriptionsService,
          useValue: {
            getDailySubscribers: jest.fn(),
            getHourlySubscribers: jest.fn(),
            deleteSubscription: jest.fn(),
          },
        },
        {
          provide: AbstractMailService,
          useValue: {
            sendDailyForecast: jest.fn(),
            sendHourlyForecast: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(WeatherNotification);
    weatherService = module.get(WeatherService);
    subscriptionsService = module.get(SubscriptionsService);
    mailService = module.get(AbstractMailService);
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

      jest
        .spyOn(subscriptionsService, 'getDailySubscribers')
        .mockResolvedValue(
          subscribers as unknown as SubscriptionWithUserAndCity[]
        );
      jest
        .spyOn(weatherService, 'getDailyForecast')
        .mockResolvedValue(forecast);
      const sendSpy = jest
        .spyOn(mailService, 'sendDailyForecast')
        .mockResolvedValue();

      await service.notifyDailySubscribers();

      expect(sendSpy).toHaveBeenCalledTimes(subscribers.length);
      expect(weatherService.getDailyForecast).toHaveBeenCalledTimes(2);
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

      jest
        .spyOn(subscriptionsService, 'getHourlySubscribers')
        .mockResolvedValue(
          subscribers as unknown as SubscriptionWithUserAndCity[]
        );
      jest
        .spyOn(weatherService, 'getHourlyForecast')
        .mockResolvedValue(forecast);
      const sendSpy = jest
        .spyOn(mailService, 'sendHourlyForecast')
        .mockResolvedValue();

      await service.notifyHourlySubscribers();

      expect(sendSpy).toHaveBeenCalledTimes(subscribers.length);
      expect(sendSpy).toHaveBeenCalledWith({
        email: 'lviv@ukr.net',
        city: 'Lviv',
        ...forecast,
      });
    });
  });
});
