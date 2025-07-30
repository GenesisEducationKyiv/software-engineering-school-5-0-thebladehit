import { Controller, Logger, UseInterceptors } from '@nestjs/common';

import {
  DurationInterceptor,
  TotalRequestsInterceptor,
} from '@app/common/interceptors';
import {
  CitiesDailyForecast,
  CitiesHourlyForecast,
  CitiesRequests,
  CityRequest,
  WeatherResponse,
  WeatherServiceController,
  WeatherServiceControllerMethods,
} from '@app/common/proto/weather';
import { CityQueryDto } from '@app/common/types';
import { mapGrpcError, validateAndGetDto } from '@app/common/utils';

import { ForecastsDto } from './dto/forecasts.dto';
import { WeatherService } from './weather.service';

@UseInterceptors(DurationInterceptor, TotalRequestsInterceptor)
@Controller()
@WeatherServiceControllerMethods()
export class WeatherController implements WeatherServiceController {
  private readonly logger = new Logger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  async getWeather(query: CityRequest): Promise<WeatherResponse> {
    try {
      const dto = await validateAndGetDto(CityQueryDto, query);
      return await this.weatherService.getWeather(dto.city);
    } catch (err) {
      this.logger.error(err);
      mapGrpcError(err);
    }
  }

  async getDailyForecasts(query: CitiesRequests): Promise<CitiesDailyForecast> {
    try {
      const dto = await validateAndGetDto(ForecastsDto, query);
      const dailyForecasts = await this.weatherService.getDailyForecasts(
        dto.cities
      );
      return { forecasts: dailyForecasts };
    } catch (err) {
      this.logger.error(err);
      mapGrpcError(err);
    }
  }

  async getHourlyForecasts(
    query: CitiesRequests
  ): Promise<CitiesHourlyForecast> {
    try {
      const dto = await validateAndGetDto(ForecastsDto, query);
      const hourlyForecasts = await this.weatherService.getHourlyForecasts(
        dto.cities
      );
      return { forecasts: hourlyForecasts };
    } catch (err) {
      this.logger.error(err);
      mapGrpcError(err);
    }
  }
}
