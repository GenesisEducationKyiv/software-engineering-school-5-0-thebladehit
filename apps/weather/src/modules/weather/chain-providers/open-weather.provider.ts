import { Injectable } from '@nestjs/common';

import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { OpenWeatherService } from '../../open-weather/open-weather.service';

import { BaseWeatherProvider } from './base-weather.provider';

@Injectable()
export class OpenWeatherProvider extends BaseWeatherProvider {
  constructor(private readonly openWeatherService: OpenWeatherService) {
    super();
  }

  protected handleDailyForecast(
    city: string
  ): Promise<WeatherDailyForecastDto> {
    return this.openWeatherService.getDailyForecast(city);
  }

  protected handleHourlyForecast(
    city: string
  ): Promise<WeatherHourlyForecastDto> {
    return this.openWeatherService.getHourlyForecast(city);
  }

  protected handleWeather(city: string): Promise<WeatherResponseDto> {
    return this.openWeatherService.getWeather(city);
  }
}
