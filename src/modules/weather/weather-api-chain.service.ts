import { InternalServerErrorException } from '@nestjs/common';

import { AbstractWeatherApiChainService } from '../abstracts/weather-api-chain.abstract';

import { WeatherDailyForecastDto } from './dto/weather-daily-forecast.dto';
import { WeatherHourlyForecastDto } from './dto/weather-hourly-forecast.dto';
import { WeatherResponseDto } from './dto/weather.dto';

export class WeatherApiChainService implements AbstractWeatherApiChainService {
  protected next?: AbstractWeatherApiChainService;

  constructor(...weatherApiProviders: AbstractWeatherApiChainService[]) {
    this.setupChain(weatherApiProviders);
  }

  setNext(next: AbstractWeatherApiChainService): void {
    this.next = next;
  }

  private setupChain(
    weatherApiProviders: AbstractWeatherApiChainService[]
  ): void {
    if (weatherApiProviders.length === 0) {
      return;
    }
    let currentProvider = weatherApiProviders[0];
    this.setNext(currentProvider);
    for (let i = 1; i < weatherApiProviders.length; i++) {
      const nextProvider = weatherApiProviders[i];
      currentProvider.setNext(nextProvider);
      currentProvider = nextProvider;
    }
  }

  getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    if (!this.next) {
      throw new InternalServerErrorException('No providers');
    }
    return this.next.getDailyForecast(city);
  }

  getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    if (!this.next) {
      throw new InternalServerErrorException('No providers');
    }
    return this.next.getHourlyForecast(city);
  }

  getWeather(city: string): Promise<WeatherResponseDto> {
    if (!this.next) {
      throw new InternalServerErrorException('No providers');
    }
    return this.next.getWeather(city);
  }
}
