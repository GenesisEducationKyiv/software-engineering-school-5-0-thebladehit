import { Injectable } from '@nestjs/common';

import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { WeatherAPIService } from '../../weather-api/weather-api.service';

import { BaseWeatherProvider } from './base-weather.provider';

@Injectable()
export class WeatherApiProvider extends BaseWeatherProvider {
  constructor(private readonly weatherApiService: WeatherAPIService) {
    super();
  }

  protected handleDailyForecast(
    city: string
  ): Promise<WeatherDailyForecastDto> {
    return this.weatherApiService.getDailyForecast(city);
  }

  protected handleHourlyForecast(
    city: string
  ): Promise<WeatherHourlyForecastDto> {
    return this.weatherApiService.getHourlyForecast(city);
  }

  protected handleWeather(city: string): Promise<WeatherResponseDto> {
    return this.weatherApiService.getWeather(city);
  }
}
