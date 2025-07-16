import { Controller, Get, Query } from '@nestjs/common';

import { CityQueryDto, WeatherResponseDto } from '@app/common/types';
import { mapGrpcToHttpError } from '@app/common/utils';

import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly service: WeatherService) {}

  @Get()
  async getWeather(@Query() query: CityQueryDto): Promise<WeatherResponseDto> {
    try {
      return await this.service.getWeather(query.city);
    } catch (err) {
      mapGrpcToHttpError(err);
    }
  }
}
