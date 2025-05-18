import { Test, TestingModule } from '@nestjs/testing';
import { WeatherApiService } from '../external-contracts/weather-api.service';
import { WeatherAPIImplService } from './weatherAPIImpl.service';
import { ConfigService } from '@nestjs/config';
import { InvalidCityException } from '../errors/invalid-city.exception';

const fakeAPIUrl = 'http://fake-api.com';

describe('WeatherAPIImplService', () => {
  let service: WeatherApiService;
  let configService: ConfigService;

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
          provide: WeatherApiService,
          useClass: WeatherAPIImplService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get(WeatherApiService);
    configService = module.get(ConfigService);
    global.fetch = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return data from cache if not expired', async () => {
      const city = 'Kyiv';
      const cached = {
        temperature: 20,
        humidity: 60,
        description: 'Sunny',
      };

      service['cache'].set(city, {
        data: cached,
        timestamp: Date.now(),
      });

      const result = await service.getWeather(city);

      expect(result).toEqual(cached);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should fetch data and cache it if no valid cache', async () => {
      const city = 'Lviv';
      const apiResponse = {
        current: {
          temp_c: 10,
          humidity: 80,
          condition: { text: 'Rainy' },
        },
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(apiResponse),
      });

      const result = await service.getWeather(city);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${fakeAPIUrl}/current.json`)
      );

      expect(result).toEqual({
        temperature: 10,
        humidity: 80,
        description: 'Rainy',
      });

      const cached = service['cache'].get(city);
      expect(cached?.data).toEqual(result);
    });

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

      await expect(service.getWeather(city)).rejects.toThrow(
        InvalidCityException
      );
    });

    it('should throw general error for unknown errors', async () => {
      const city = 'SomeCity';

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: {
            code: 5000,
            message: 'Internal error',
          },
        }),
      });

      await expect(service.getWeather(city)).rejects.toThrow(
        'Internal application error'
      );
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
