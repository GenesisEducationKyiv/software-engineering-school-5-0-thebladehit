import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CityOpenWeatherService } from './city-open-weather.service';
import { OpenWeatherService } from './open-weather.service';

@Module({
  imports: [HttpModule],
  providers: [OpenWeatherService, CityOpenWeatherService],
  exports: [OpenWeatherService, CityOpenWeatherService],
})
export class OpenWeatherModule {}
