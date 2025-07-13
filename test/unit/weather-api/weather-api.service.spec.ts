import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { WeatherAPIService } from '../../../apps/weather/src/modules/weather-api/weather-api.service';

describe('WeatherAPIService', () => {
  let service: WeatherAPIService;

  const mockedConfigService = {
    getOrThrow: jest.fn().mockReturnValue('test-api-key'),
    get: jest.fn((key: string) => {
      if (key === 'WEATHER_CACHE_TTL') return 600_000;
      if (key === 'WEATHER_BASE_URL') return 'http://fake-api.com';
      return null;
    }),
  };

  const mockedHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherAPIService,
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

    service = module.get(WeatherAPIService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return weather data', async () => {
      const city = 'fake city';
      const mockWeatherResponse = {
        data: {
          current: {
            condition: {
              text: 'cloudy',
            },
            humidity: 5,
            temp_c: 20,
          },
        },
      };

      mockedHttpService.get.mockReturnValue(of(mockWeatherResponse));

      const result = await service.getWeather(city);

      expect(result).toEqual({
        temperature: 20,
        humidity: 5,
        description: 'cloudy',
      });
      expect(mockedHttpService.get).toHaveBeenCalled();
    });
  });

  describe('getDailyForecast', () => {
    it('should return daily forecast', async () => {
      const city = 'Dnipro';

      const mockData = {
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
      };

      mockedHttpService.get.mockReturnValue(of(mockData));

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

      const mockData = {
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
      };

      mockedHttpService.get.mockReturnValue(of(mockData));

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
