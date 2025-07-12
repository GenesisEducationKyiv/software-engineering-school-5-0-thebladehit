import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

export abstract class AbstractWeatherCacheService {
  abstract weatherByCity: {
    get: (city: string) => Promise<WeatherResponseDto>;
    set: (
      city: string,
      data: WeatherResponseDto
    ) => Promise<WeatherResponseDto>;
    del: (city: string) => Promise<boolean>;
  };

  abstract dailyForecastByCity: {
    get: (city: string) => Promise<WeatherDailyForecastDto>;
    set: (
      city: string,
      data: WeatherDailyForecastDto
    ) => Promise<WeatherDailyForecastDto>;
    del: (city: string) => Promise<boolean>;
  };

  abstract hourlyForecastByCity: {
    get: (city: string) => Promise<WeatherHourlyForecastDto>;
    set: (
      city: string,
      data: WeatherHourlyForecastDto
    ) => Promise<WeatherHourlyForecastDto>;
    del: (city: string) => Promise<boolean>;
  };
}
