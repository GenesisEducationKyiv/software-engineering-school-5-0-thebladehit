import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { OpenWeatherService } from '../../../apps/weather/src/modules/open-weather/open-weather.service';

describe('OpenWeatherService', () => {
  let service: OpenWeatherService;

  const mockedConfigService = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      if (key === 'OPEN_WEATHER_API_KEY') return 'test-api-key';
    }),
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'OPEN_WEATHER_BASE_URL') return 'http://fake-api.com';
    }),
  };

  const mockedHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenWeatherService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: HttpService,
          useValue: mockedHttpService,
        },
      ],
    }).compile();

    service = module.get(OpenWeatherService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return current weather data', async () => {
      const mockResponse = {
        data: {
          weather: [{ description: 'clear sky' }],
          main: { temp: 25, humidity: 60 },
        },
      };

      mockedHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getWeather('Kyiv');

      expect(result).toEqual({
        temperature: 25,
        humidity: 60,
        description: 'clear sky',
      });
    });
  });

  describe('getDailyForecast', () => {
    it('should return daily forecast data', async () => {
      const mockResponse = {
        data: {
          city: { sunrise: Date.now(), sunset: Date.now() },
          list: [
            {
              main: { temp: 25 },
              pop: 0.2,
              weather: [{ description: 'sunny' }],
            },
            {
              main: { temp: 15 },
              pop: 0.3,
              weather: [{ description: 'sunny' }],
            },
          ],
        },
      };

      mockedHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getDailyForecast('Lviv');

      expect(result.description).toBe('sunny');
      expect(result.maxTemp).toBe(25);
      expect(result.minTemp).toBe(15);
    });
  });

  describe('getHourlyForecast', () => {
    it('should return hourly forecast data', async () => {
      const mockResponse = {
        data: {
          list: [
            {
              main: {
                temp: 20,
                feels_like: 18,
                humidity: 55,
              },
              weather: [{ description: 'cloudy' }],
              pop: 0.1,
            },
          ],
        },
      };

      mockedHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getHourlyForecast('Odesa');

      expect(result).toEqual({
        temp: 20,
        description: 'cloudy',
        feelsLikeTemp: 18,
        humidity: 55,
        chanceOfRain: 0.1,
      });
    });
  });
});
