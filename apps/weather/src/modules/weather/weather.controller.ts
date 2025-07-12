import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CityQueryDto, WeatherResponseDto } from '@app/common/types';

import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getWeather(@Query() query: CityQueryDto): Promise<WeatherResponseDto> {
    return this.weatherService.getWeather(query.city);
  }
}
