import { Controller, Get, Query } from '@nestjs/common';

import { CityQueryDto, WeatherResponseDto } from '@app/common/types';

import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly service: WeatherService) {}

  @Get()
  getWeather(@Query() query: CityQueryDto): Promise<WeatherResponseDto> {
    return this.service.getWeather(query.city);
  }
}
