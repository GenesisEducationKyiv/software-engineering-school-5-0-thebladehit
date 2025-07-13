import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  CitiesDailyForecastDto,
  CitiesHourlyForecastDto,
  CityQueryDto,
  WeatherResponseDto,
} from '@app/common/types';

import { ForecastsDto } from './dto/forecasts.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getWeather(@Query() query: CityQueryDto): Promise<WeatherResponseDto> {
    return this.weatherService.getWeather(query.city);
  }

  @Post('/daily-forecasts')
  getDailyForecasts(
    @Body() dto: ForecastsDto
  ): Promise<CitiesDailyForecastDto> {
    return this.weatherService.getDailyForecasts(dto.cities);
  }

  @Post('/hourly-forecasts')
  getHourlyForecasts(
    @Body() dto: ForecastsDto
  ): Promise<CitiesHourlyForecastDto> {
    return this.weatherService.getHourlyForecasts(dto.cities);
  }
}
