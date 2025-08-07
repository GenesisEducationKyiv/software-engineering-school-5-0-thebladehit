import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  WEATHER_PACKAGE_NAME,
  WEATHER_SERVICE_NAME,
  WeatherServiceClient,
} from '@app/common/proto/weather';
import { WeatherResponseDto } from '@app/common/types';

@Injectable()
export class WeatherService implements OnModuleInit {
  private readonly logger = new Logger(WeatherService.name);
  private weatherGrpcService: WeatherServiceClient;

  constructor(
    @Inject(WEATHER_PACKAGE_NAME) private readonly client: ClientGrpc
  ) {}

  onModuleInit(): void {
    this.weatherGrpcService =
      this.client.getService<WeatherServiceClient>(WEATHER_SERVICE_NAME);
  }

  getWeather(city: string): Promise<WeatherResponseDto> {
    return firstValueFrom(this.weatherGrpcService.getWeather({ city }));
  }
}
