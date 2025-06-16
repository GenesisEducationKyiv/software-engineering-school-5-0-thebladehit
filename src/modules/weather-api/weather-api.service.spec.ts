import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';

import { WeatherAPIService } from './weather-api.service';

describe('WeatherAPIService', () => {
  let service: AbstractWeatherApiService;

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-api-key'),
    get: jest.fn((key: string) => {
      if (key === 'WEATHER_CACHE_TTL') return 600_000;
      if (key === 'WEATHER_BASE_URL') return 'http://fake-api.com';
      return null;
    }),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AbstractWeatherApiService,
          useClass: WeatherAPIService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get(AbstractWeatherApiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should throw NotFound if response error is 1006', async () => {
      const city = 'FakeCity';

      const errorResponse = {
        response: {
          data: {
            error: { code: 1006, message: 'No matching location found.' },
          },
        },
      };

      mockHttpService.get.mockReturnValue(throwError(() => errorResponse));

      await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDailyForecast', () => {
    it('should return daily forecast', async () => {
      const city = 'Dnipro';

      const mockData: AxiosResponse = {
        data: {
          forecast: {
            forecastday: [
              {
                day: {
                  maxtemp_c: 25,
                  mintemp_c: 15,
                  avgtemp_c: 20,
                  avghumidity: 70,
                  daily_chance_of_rain: 30,
                  condition: { text: 'Clear' },
                },
                astro: {
                  sunrise: '06:00 AM',
                  sunset: '08:00 PM',
                },
              },
            ],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      mockHttpService.get.mockReturnValue(of(mockData));

      const result = await service.getDailyForecast(city);

      expect(result).toEqual({
        maxTemp: 25,
        minTemp: 15,
        avgTemp: 20,
        avgHumidity: 70,
        chanceOfRain: 30,
        description: 'Clear',
        sunrise: '06:00 AM',
        sunset: '08:00 PM',
      });
    });
  });

  describe('getHourlyForecast', () => {
    it('should return hourly forecast', async () => {
      const city = 'Odesa';

      const mockData: AxiosResponse = {
        data: {
          forecast: {
            forecastday: [
              {
                hour: [
                  {
                    temp_c: 18,
                    condition: { text: 'Partly cloudy' },
                    feelslike_c: 16,
                    humidity: 65,
                    chance_of_rain: 10,
                  },
                ],
              },
            ],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      mockHttpService.get.mockReturnValue(of(mockData));

      const result = await service.getHourlyForecast(city);

      expect(result).toEqual({
        temp: 18,
        description: 'Partly cloudy',
        feelsLikeTemp: 16,
        humidity: 65,
        chance_of_rain: 10,
      });
    });
  });
});
