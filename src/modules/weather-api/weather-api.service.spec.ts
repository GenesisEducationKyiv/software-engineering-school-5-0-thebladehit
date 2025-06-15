import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';

import { WeatherAPIService } from './weather-api.service';

const fakeAPIUrl = 'http://fake-api.com';

describe('WeatherAPIImplService', () => {
  let service: AbstractWeatherApiService;
  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-api-key'),
    get: jest.fn((key: string) => {
      if (key === 'WEATHER_CACHE_TTL') return 600_000;
      if (key === 'WEATHER_BASE_URL') return fakeAPIUrl;
      return null;
    }),
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
      ],
    }).compile();

    service = module.get(AbstractWeatherApiService);
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should throw NotFound if response error is 1006', async () => {
      const city = 'FakeCity';

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: {
            code: 1006,
            message: 'No matching location found.',
          },
        }),
      });

      await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDailyForecast', () => {
    it('should return daily forecast', async () => {
      const city = 'Dnipro';

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
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
        }),
      });

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

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
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
        }),
      });

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
