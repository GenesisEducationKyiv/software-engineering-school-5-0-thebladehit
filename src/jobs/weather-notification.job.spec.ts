import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../modules/weather/weather.service';
import { SubscriptionsService } from '../modules/subscriptions/subscriptions.service';
import { MailService } from '../modules/mail/contracts/mail.service';
import { WeatherNotificationService } from './weather-notification.job';
import { Subscription } from '@prisma/client';

describe('WeatherNotificationService', () => {
  let service: WeatherNotificationService;
  let weatherService: WeatherService;
  let subscriptionsService: SubscriptionsService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherNotificationService,
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
          provide: MailService,
          useValue: {
            sendDailyForecast: jest.fn(),
            sendHourlyForecast: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(WeatherNotificationService);
    weatherService = module.get(WeatherService);
    subscriptionsService = module.get(SubscriptionsService);
    mailService = module.get(MailService);
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

      jest.spyOn(subscriptionsService, 'getDailySubscribers').mockResolvedValue(subscribers as any);
      jest.spyOn(weatherService, 'getDailyForecast').mockResolvedValue(forecast as any);
      const sendSpy = jest.spyOn(mailService, 'sendDailyForecast').mockResolvedValue();

      await service.notifyDailySubscribers();

      expect(sendSpy).toHaveBeenCalledTimes(subscribers.length);
      expect(weatherService.getDailyForecast).toHaveBeenCalledTimes(1);
    });

    it('should delete subscription if forecast is unavailable (daily)', async () => {
      const subscribers = [
        { id: '1', city: 'Nowhere', user: { email: 'x@x.com' } },
      ];

      jest.spyOn(subscriptionsService, 'getDailySubscribers').mockResolvedValue(subscribers as any);
      jest.spyOn(weatherService, 'getDailyForecast').mockResolvedValue(null);
      const deleteSpy = jest.spyOn(subscriptionsService, 'deleteSubscription').mockResolvedValue({} as Subscription);

      await service.notifyDailySubscribers();

      expect(deleteSpy).toHaveBeenCalledWith('1');
    });
  });

  describe('notifyHourlySubscribers', () => {
    it('should send hourly forecasts to subscribers', async () => {
      const subscribers = [
        { id: '1', city: 'Lviv', user: { email: 'lviv@ukr.net' } },
      ];
      const forecast = {
        temp: 17,
        description: 'Cloudy',
        feelsLikeTemp: 16,
        humidity: 60,
        chance_of_rain: 40,
      };

      jest.spyOn(subscriptionsService, 'getHourlySubscribers').mockResolvedValue(subscribers as any);
      jest.spyOn(weatherService, 'getHourlyForecast').mockResolvedValue(forecast as any);
      const sendSpy = jest.spyOn(mailService, 'sendHourlyForecast').mockResolvedValue();

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
