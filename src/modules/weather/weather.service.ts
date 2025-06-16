import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WeatherCurrentDto } from './dto/weather-current.dto';
import { WeatherDailyForecastDto } from './dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from './dto/weather-hourly-forecast.dto';
import { InvalidCityException } from './errors/invalid-city.exception';
import { WeatherApiService } from './external-contracts/weather-api.service';

@Injectable()
export class WeatherService {
  constructor(private readonly weatherApiService: WeatherApiService) {}

  async getWeather(city: string): Promise<WeatherCurrentDto> {
    try {
      return await this.weatherApiService.getWeather(city);
    } catch (error) {
      if (error instanceof InvalidCityException) {
        throw new NotFoundException(`City: ${city} not found`);
      }
      throw new BadRequestException(error);
    }
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    try {
      return await this.weatherApiService.getDailyForecast(city);
    } catch (error) {
      if (error instanceof InvalidCityException) {
        return null;
      }
      throw error;
    }
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    try {
      return await this.weatherApiService.getHourlyForecast(city);
    } catch (error) {
      if (error instanceof InvalidCityException) {
        return null;
      }
      throw error;
    }
  }
}
