import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WeatherCurrentDto } from './dto/weather-current.dto';
import { WeatherDailyForecastDto } from './dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from './dto/weather-hourly-forecast.dto';
import { AbstractWeatherApiService } from '../abstracts/weather-api.abstract';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApiService: AbstractWeatherApiService) {}

  async getWeather(city: string): Promise<WeatherCurrentDto> {
    try {
      return await this.weatherApiService.getWeather(city);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    return await this.weatherApiService.getDailyForecast(city);
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    return await this.weatherApiService.getHourlyForecast(city);
  }
}
