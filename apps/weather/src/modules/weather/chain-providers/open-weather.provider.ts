import { Injectable } from '@nestjs/common';

import { OpenWeatherService } from '../../open-weather/open-weather.service';
import { WeatherDailyForecastDto } from '../dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from '../dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from '../dto/weather-response.dto';

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
