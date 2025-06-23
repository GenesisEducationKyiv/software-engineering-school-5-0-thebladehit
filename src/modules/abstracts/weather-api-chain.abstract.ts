import { WeatherDailyForecastDto } from '../weather/dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../weather/dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../weather/dto/weather.dto';

import { AbstractWeatherApiService } from './weather-api.abstract';

export abstract class AbstractWeatherApiChainService
  implements AbstractWeatherApiService
{
  abstract setNext(next: AbstractWeatherApiChainService): void;
  abstract getWeather(city: string): Promise<WeatherResponseDto>;
  abstract getDailyForecast(city: string): Promise<WeatherDailyForecastDto>;
  abstract getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto>;
}
