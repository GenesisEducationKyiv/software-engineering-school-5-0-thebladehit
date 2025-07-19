import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

import { CityNotFoundException } from '@app/common/errors';
import { OpenWeatherService } from '../../apps/weather/src/modules/open-weather/open-weather.service';
import { OpenWeatherProvider } from '../../apps/weather/src/modules/weather/chain-providers/open-weather.provider';
import { WeatherApiProvider } from '../../apps/weather/src/modules/weather/chain-providers/weather-api.provider';
import { WeatherApiChainService } from '../../apps/weather/src/modules/weather/weather-api-chain.service';
import { WeatherAPIService } from '../../apps/weather/src/modules/weather-api/weather-api.service';

const mockedConfigService = {
  getOrThrow: jest.fn().mockReturnValue('test-api-key'),
  get: jest.fn().mockReturnValue('http://fake-weather-api.com'),
};

const mockedHttpService = {
  get: jest.fn(),
};

const city = 'fake city';

describe('WeatherApiChainService', () => {
  let service: WeatherApiChainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherAPIService,
        OpenWeatherService,
        WeatherApiProvider,
        OpenWeatherProvider,
        WeatherApiChainService,
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

    service = module.get(WeatherApiChainService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    it('should return data from first provider', async () => {
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
      expect(mockedHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should return data from second provider', async () => {
      const axiosError = {
        response: {
          data: {
            error: { code: 1006 },
          },
        },
      };

      const mockResponse = {
        data: {
          weather: [{ description: 'clear sky' }],
          main: { temp: 25, humidity: 60 },
        },
      };

      mockedHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      mockedHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getWeather(city);

      expect(result).toEqual({
        temperature: 25,
        humidity: 60,
        description: 'clear sky',
      });
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFound exception', async () => {
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: {
            data: {
              error: { code: 1006 },
            },
          },
        }))
      );
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { cod: 404 } },
        }))
      );

      await expect(service.getWeather(city)).rejects.toThrow(
        CityNotFoundException
      );
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getDailyForecast', () => {
    it('should return data from first provider', async () => {
      const mockedResponse = {
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

      mockedHttpService.get.mockReturnValue(of(mockedResponse));

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
      expect(mockedHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should return data from second provider', async () => {
      const axiosError = {
        response: {
          data: {
            error: { code: 1006 },
          },
        },
      };

      const mockResponse = {
        data: {
          list: [
            {
              main: { temp: 20, humidity: 10 },
              weather: [{ description: 'Clear' }],
              pop: 0.2,
            },
            {
              main: { temp: 25, humidity: 10 },
              weather: [{ description: 'Clear' }],
              pop: 0.3,
            },
          ],
          city: {
            sunrise: Date.now(),
            sunset: Date.now() + 3600000,
          },
        },
      };

      mockedHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      mockedHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getDailyForecast(city);

      expect(result).toEqual({
        maxTemp: 25,
        minTemp: 20,
        avgTemp: 22.5,
        avgHumidity: 10,
        chanceOfRain: 1 - (1 - 0.2) * (1 - 0.3),
        description: 'Clear',
        sunrise: new Date(mockResponse.data.city.sunrise).toISOString(),
        sunset: new Date(mockResponse.data.city.sunset).toISOString(),
      });
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFound exception', async () => {
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: {
            data: {
              error: { code: 1006 },
            },
          },
        }))
      );
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { cod: 404 } },
        }))
      );

      await expect(service.getDailyForecast(city)).rejects.toThrow(
        CityNotFoundException
      );
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getHourlyForecast', () => {
    it('should return data from first provider', async () => {
      const mockResponse = {
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

      mockedHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.getHourlyForecast(city);

      expect(result).toEqual({
        temp: 18,
        description: 'Partly cloudy',
        feelsLikeTemp: 16,
        humidity: 65,
        chanceOfRain: 10,
      });
      expect(mockedHttpService.get).toHaveBeenCalledTimes(1);
    });

    it('should return data from second provider', async () => {
      const axiosError = {
        response: {
          data: {
            error: { code: 1006 },
          },
        },
      };

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

      mockedHttpService.get.mockReturnValueOnce(throwError(() => axiosError));
      mockedHttpService.get.mockReturnValueOnce(of(mockResponse));

      const result = await service.getHourlyForecast(city);

      expect(result).toEqual({
        temp: 20,
        description: 'cloudy',
        feelsLikeTemp: 18,
        humidity: 55,
        chanceOfRain: 0.1,
      });
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFound exception', async () => {
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: {
            data: {
              error: { code: 1006 },
            },
          },
        }))
      );
      mockedHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { cod: 404 } },
        }))
      );

      await expect(service.getHourlyForecast(city)).rejects.toThrow(
        CityNotFoundException
      );
      expect(mockedHttpService.get).toHaveBeenCalledTimes(2);
    });
  });
});
