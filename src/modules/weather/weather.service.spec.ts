import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { WeatherApiService } from './external-contracts/weather-api.service';
import { InvalidCityException } from './errors/invalid-city.exception';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WeatherCurrentDto } from './dto/weather-current.dto';
import { WeatherDailyForecastDto } from './dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from './dto/weather-hourly-forecast.dto';

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherApiService: jest.Mocked<WeatherApiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherApiService,
          useValue: {
            getWeather: jest.fn(),
            getDailyForecast: jest.fn(),
            getHourlyForecast: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(WeatherService);
    weatherApiService = module.get(WeatherApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeather', () => {
    const city = 'fake city';

    it('should return weather if API call succeeds', async () => {
      const mockWeather: WeatherCurrentDto = {
        temperature: 22,
        humidity: 50,
        description: 'fake description',
      };

      weatherApiService.getWeather.mockResolvedValue(mockWeather);

      const result = await service.getWeather(city);
      expect(result).toEqual(mockWeather);
      expect(weatherApiService.getWeather).toHaveBeenCalledWith(city);
    });

    it('should throw NotFoundException if InvalidCityException is thrown', async () => {
      weatherApiService.getWeather.mockRejectedValue(
        new InvalidCityException('invalid city')
      );

      await expect(service.getWeather(city)).rejects.toThrow(NotFoundException);
      expect(weatherApiService.getWeather).toHaveBeenCalledWith(city);
    });

    it('should throw BadRequestException for unknown errors', async () => {
      const error = new Error('Something went wrong');
      weatherApiService.getWeather.mockRejectedValue(error);

      await expect(service.getWeather(city)).rejects.toThrow(
        BadRequestException
      );
      expect(weatherApiService.getWeather).toHaveBeenCalledWith(city);
    });
  });

  describe('getDailyForecast', () => {
    const city = 'fake city';

    it('should return daily weather forecast if API call succeeds', async () => {
      const mockWeather = {
        maxTemp: 22,
      } as WeatherDailyForecastDto;

      weatherApiService.getDailyForecast.mockResolvedValue(mockWeather);

      const result = await service.getDailyForecast(city);
      expect(result).toEqual(mockWeather);
      expect(weatherApiService.getDailyForecast).toHaveBeenCalledWith(city);
    });

    it('should return null if InvalidCityException is thrown', async () => {
      weatherApiService.getDailyForecast.mockRejectedValue(
        new InvalidCityException('invalid city')
      );

      const result = await service.getDailyForecast(city);

      expect(result).toEqual(null);
      expect(weatherApiService.getDailyForecast).toHaveBeenCalledWith(city);
    });

    it('should throw Error for unknown errors', async () => {
      const error = new Error('Something went wrong');
      weatherApiService.getDailyForecast.mockRejectedValue(error);

      await expect(service.getDailyForecast(city)).rejects.toThrow(Error);
      expect(weatherApiService.getDailyForecast).toHaveBeenCalledWith(city);
    });
  });

  describe('getHourlyForecast', () => {
    const city = 'fake city';

    it('should return hourly weather forecast if API call succeeds', async () => {
      const mockWeather = {
        temp: 22,
      } as WeatherHourlyForecastDto;

      weatherApiService.getHourlyForecast.mockResolvedValue(mockWeather);

      const result = await service.getHourlyForecast(city);
      expect(result).toEqual(mockWeather);
      expect(weatherApiService.getHourlyForecast).toHaveBeenCalledWith(city);
    });

    it('should return null if InvalidCityException is thrown', async () => {
      weatherApiService.getHourlyForecast.mockRejectedValue(
        new InvalidCityException('invalid city')
      );

      const result = await service.getHourlyForecast(city);

      expect(result).toEqual(null);
      expect(weatherApiService.getHourlyForecast).toHaveBeenCalledWith(city);
    });

    it('should throw Error for unknown errors', async () => {
      const error = new Error('Something went wrong');
      weatherApiService.getHourlyForecast.mockRejectedValue(error);

      await expect(service.getHourlyForecast(city)).rejects.toThrow(Error);
      expect(weatherApiService.getHourlyForecast).toHaveBeenCalledWith(city);
    });
  });
});
