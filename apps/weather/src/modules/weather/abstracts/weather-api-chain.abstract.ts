import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { AbstractWeatherApiService } from '../../../abstracts/weather-api.abstract';

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
