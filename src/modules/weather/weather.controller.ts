import {Controller, Get, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { WeatherService } from './weather.service';
import {CityQueryDto} from "./dto/city-query.dto";

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getWeather(@Query() query: CityQueryDto) {
    return this.weatherService.getWeather(query.city);
  }
}
