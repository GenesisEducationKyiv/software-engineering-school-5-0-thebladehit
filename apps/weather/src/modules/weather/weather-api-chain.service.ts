import { Injectable, Logger } from '@nestjs/common';

import {
  WeatherDailyForecastDto,
  WeatherHourlyForecastDto,
  WeatherResponseDto,
} from '@app/common/types';

import { AbstractWeatherApiService } from '../../abstracts/weather-api.abstract';

import { AbstractWeatherApiChainService } from './abstracts/weather-api-chain.abstract';
import { OpenWeatherProvider } from './chain-providers/open-weather.provider';
import { WeatherApiProvider } from './chain-providers/weather-api.provider';

@Injectable()
export class WeatherApiChainService implements AbstractWeatherApiService {
  private readonly providerChain: AbstractWeatherApiChainService;
  private readonly logger = new Logger(WeatherApiChainService.name);

  constructor(
    private readonly weatherApiProvider: WeatherApiProvider,
    private readonly openWeatherProvider: OpenWeatherProvider
  ) {
    this.providerChain = this.weatherApiProvider;
    this.providerChain.setNext(this.openWeatherProvider);
  }

  async getDailyForecast(city: string): Promise<WeatherDailyForecastDto> {
    try {
      return await this.providerChain.getDailyForecast(city);
    } catch (err) {
      this.logger.error(
        `Unable to get Daily Forecast for city: ${city} from all providers`
      );
      throw err;
    }
  }

  async getHourlyForecast(city: string): Promise<WeatherHourlyForecastDto> {
    try {
      return await this.providerChain.getHourlyForecast(city);
    } catch (err) {
      this.logger.error(
        `Unable to get Hourly Forecast for city: ${city} from all providers`
      );
      throw err;
    }
  }

  async getWeather(city: string): Promise<WeatherResponseDto> {
    try {
      return await this.providerChain.getWeather(city);
    } catch (err) {
      this.logger.error(
        `Unable to get Weather for city: ${city} from all providers`
      );
      throw err;
    }
  }
}
