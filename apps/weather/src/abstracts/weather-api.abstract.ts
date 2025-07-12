import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

export abstract class AbstractWeatherApiService {
  abstract getWeather(city: string): Promise<WeatherResponseDto>;
  abstract getDailyForecast(city: string): Promise<WeatherDailyForecastDto>;
  abstract getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto>;
}
