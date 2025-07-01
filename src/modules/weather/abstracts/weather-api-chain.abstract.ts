import { AbstractWeatherApiService } from '../../../abstracts/weather-api.abstract';
import { WeatherDailyForecastDto } from '../dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../dto/weather.dto';

export abstract class AbstractWeatherApiChainService
  implements AbstractWeatherApiService
{
  abstract setNext(
    next: AbstractWeatherApiChainService
  ): AbstractWeatherApiChainService;
  abstract getWeather(city: string): Promise<WeatherResponseDto>;
  abstract getDailyForecast(city: string): Promise<WeatherDailyForecastDto>;
  abstract getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto>;
}
