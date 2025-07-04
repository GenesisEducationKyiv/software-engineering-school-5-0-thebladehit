import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AbstractWeatherApiService } from '../../../src/abstracts/weather-api.abstract';
import { AbstractMetricsService } from '../../../src/modules/metrics/abstracts/metrics.service.abstract';
import { AbstractWeatherCacheService } from '../../../src/modules/weather/abstracts/weather-cache.service.abstract';
import { WeatherDailyForecastDto } from '../../../src/modules/weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../../../src/modules/weather/dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../../../src/modules/weather/dto/weather.dto';
import { WeatherService } from '../../../src/modules/weather/weather.service';

describe('WeatherService', () => {
  let service: WeatherService;

  const mockedWeatherApiService = {
    getWeather: jest.fn(),
    getDailyForecast: jest.fn(),
    getHourlyForecast: jest.fn(),
  };

  const mockedWeatherCacheService = {
    weatherByCity: {
      get: jest.fn(),
      set: jest.fn(),
    },
    dailyForecastByCity: {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    },
    hourlyForecastByCity: {
      get: jest.fn(),
      set: jest.fn(),
    },
  };

  const mockedMetricService = {
    incFromCache: jest.fn(),
    incFromApi: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: AbstractWeatherApiService,
          useValue: mockedWeatherApiService,
        },
        {
          provide: AbstractWeatherCacheService,
          useValue: mockedWeatherCacheService,
        },
        {
          provide: AbstractMetricsService,
          useValue: mockedMetricService,
        },
      ],
    }).compile();

    service = module.get(WeatherService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    const city = 'fake city';

    const mockWeather: WeatherResponseDto = {
      temperature: 22,
      humidity: 50,
      description: 'fake description',
    };

    it('should return weather if API call succeeds and save it to cache', async () => {
      mockedWeatherCacheService.weatherByCity.get.mockResolvedValue(undefined);
      mockedWeatherCacheService.weatherByCity.set.mockResolvedValue(undefined);
      mockedWeatherApiService.getWeather.mockResolvedValue(mockWeather);

      const result = await service.getWeather(city);
      expect(result).toEqual(mockWeather);
      expect(mockedWeatherCacheService.weatherByCity.get).toHaveBeenCalledWith(
        city
      );
      expect(mockedWeatherApiService.getWeather).toHaveBeenCalledWith(city);
      expect(mockedWeatherCacheService.weatherByCity.set).toHaveBeenCalledWith(
        city,
        mockWeather
      );
      expect(mockedMetricService.incFromApi).toHaveBeenCalled();
    });

    it('should return weather from cache', async () => {
      const mockWeather: WeatherResponseDto = {
        temperature: 22,
        humidity: 50,
        description: 'fake description',
      };

      mockedWeatherCacheService.weatherByCity.get.mockResolvedValue(
        mockWeather
      );

      const result = await service.getWeather(city);
      expect(result).toEqual(mockWeather);
      expect(mockedWeatherCacheService.weatherByCity.get).toHaveBeenCalledWith(
        city
      );
      expect(mockedMetricService.incFromCache).toHaveBeenCalled();
    });

    it('should throw NotFoundException if city is invalid', async () => {
      mockedWeatherCacheService.weatherByCity.get.mockResolvedValue(undefined);
      mockedWeatherApiService.getWeather.mockRejectedValue(
        new NotFoundException()
      );

      await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
      expect(mockedWeatherApiService.getWeather).toHaveBeenCalledWith(city);
    });

    it('should throw BadRequestException for unknown errors', async () => {
      mockedWeatherCacheService.weatherByCity.get.mockResolvedValue(undefined);
      mockedWeatherApiService.getWeather.mockRejectedValue(
        new BadRequestException()
      );

      await expect(service.getWeather(city)).rejects.toThrow(
        BadRequestException
      );
      expect(mockedWeatherApiService.getWeather).toHaveBeenCalledWith(city);
    });
  });

  describe('getDailyForecast', () => {
    const city = 'fake city';

    const mockWeather = {
      maxTemp: 22,
    } as WeatherDailyForecastDto;

    it('should return daily weather forecast if API call succeeds and save it to cache', async () => {
      mockedWeatherApiService.getDailyForecast.mockResolvedValue(mockWeather);
      mockedWeatherCacheService.dailyForecastByCity.get.mockResolvedValue(
        undefined
      );
      mockedWeatherCacheService.dailyForecastByCity.set.mockResolvedValue(
        undefined
      );

      const result = await service.getDailyForecast(city);

      expect(result).toEqual(mockWeather);
      expect(mockedWeatherApiService.getDailyForecast).toHaveBeenCalledWith(
        city
      );
      expect(
        mockedWeatherCacheService.dailyForecastByCity.get
      ).toHaveBeenCalledWith(city);
      expect(
        mockedWeatherCacheService.dailyForecastByCity.set
      ).toHaveBeenCalledWith(city, mockWeather);
      expect(mockedMetricService.incFromApi).toHaveBeenCalled();
    });

    it('should return forecast from cache', async () => {
      mockedWeatherCacheService.dailyForecastByCity.get.mockResolvedValue(
        mockWeather
      );

      const result = await service.getDailyForecast(city);

      expect(result).toEqual(mockWeather);
      expect(
        mockedWeatherCacheService.dailyForecastByCity.get
      ).toHaveBeenCalledWith(city);
      expect(mockedMetricService.incFromCache).toHaveBeenCalled();
    });
  });

  describe('getHourlyForecast', () => {
    const city = 'fake city';

    const mockWeather = {
      temp: 22,
    } as WeatherHourlyForecastDto;

    it('should return hourly weather forecast if API call succeeds', async () => {
      mockedWeatherApiService.getHourlyForecast.mockResolvedValue(mockWeather);
      mockedWeatherCacheService.hourlyForecastByCity.get.mockResolvedValue(
        undefined
      );
      mockedWeatherCacheService.hourlyForecastByCity.set.mockResolvedValue(
        undefined
      );

      const result = await service.getHourlyForecast(city);

      expect(result).toEqual(mockWeather);
      expect(mockedWeatherApiService.getHourlyForecast).toHaveBeenCalledWith(
        city
      );
      expect(
        mockedWeatherCacheService.hourlyForecastByCity.get
      ).toHaveBeenCalledWith(city);
      expect(
        mockedWeatherCacheService.hourlyForecastByCity.set
      ).toHaveBeenCalledWith(city, mockWeather);
      expect(mockedMetricService.incFromApi).toHaveBeenCalled();
    });

    it('should return forecast from cache', async () => {
      mockedWeatherCacheService.hourlyForecastByCity.get.mockResolvedValue(
        mockWeather
      );

      const result = await service.getHourlyForecast(city);

      expect(result).toEqual(mockWeather);
      expect(
        mockedWeatherCacheService.hourlyForecastByCity.get
      ).toHaveBeenCalledWith(city);
      expect(mockedMetricService.incFromCache).toHaveBeenCalled();
    });
  });
});
