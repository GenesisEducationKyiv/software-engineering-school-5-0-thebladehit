import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CityQueryDto } from './dto/city-query.dto';
import { WeatherResponseDto } from './dto/weather.dto';
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
