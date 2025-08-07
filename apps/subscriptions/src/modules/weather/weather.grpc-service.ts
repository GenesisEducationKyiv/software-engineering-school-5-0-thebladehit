import {
  WEATHER_PACKAGE_NAME,
  WEATHER_SERVICE_NAME,
  WeatherServiceClient,
} from '@app/common/proto/weather';
import {
  CitiesDailyForecastDto,
  CitiesHourlyForecastDto,
} from '@app/common/types';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AbstractWeatherService } from './abstracts/weather.abstract';

export class WeatherGrpcService
  implements AbstractWeatherService, OnModuleInit
{
  private weatherGrpcService: WeatherServiceClient;

  constructor(
    @Inject(WEATHER_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  onModuleInit(): void {
    this.weatherGrpcService =
      this.client.getService<WeatherServiceClient>(WEATHER_SERVICE_NAME);
  }

  async getDailyForecasts(cities: string[]): Promise<CitiesDailyForecastDto> {
    return (
      await firstValueFrom(
        this.weatherGrpcService.getDailyForecasts({ cities })
      )
    ).forecasts;
  }

  async getHourlyForecasts(cities: string[]): Promise<CitiesHourlyForecastDto> {
    return (
      await firstValueFrom(
        this.weatherGrpcService.getHourlyForecasts({ cities })
      )
    ).forecasts;
  }
}
