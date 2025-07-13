import {
  CitiesDailyForecastDto,
  CitiesHourlyForecastDto,
} from '@app/common/types';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom, map } from 'rxjs';

import { AbstractWeatherService } from './abstracts/weather.abstract';

@Injectable()
export class WeatherHttpService implements AbstractWeatherService {
  private readonly weatherServiceUrl: string;
  private readonly logger = new Logger(WeatherHttpService.name);

  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.weatherServiceUrl = this.configService.getOrThrow('WEATHER_URL');
  }

  getDailyForecasts(cities: string[]): Promise<CitiesDailyForecastDto> {
    const url = `${this.weatherServiceUrl}/weather/daily-forecasts`;
    return this.send(url, { cities });
  }

  getHourlyForecasts(cities: string[]): Promise<CitiesHourlyForecastDto> {
    const url = `${this.weatherServiceUrl}/weather/hourly-forecasts`;
    return this.send(url, { cities });
  }

  private async send<T>(url: string, payload: unknown): Promise<T> {
    try {
      return firstValueFrom(
        this.httpService
          .post<T>(url, payload)
          .pipe(map((response) => response.data))
      );
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED') {
          this.logger.error('Weather service in not reachable');
        }
      }
      throw err;
    }
  }
}
