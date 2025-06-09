import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CityQueryDto } from './dto/city-query.dto';
import { WeatherCurrentDto } from './dto/weather-current.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getWeather(@Query() query: CityQueryDto): Promise<WeatherCurrentDto> {
    return this.weatherService.getWeather(query.city);
  }
}
