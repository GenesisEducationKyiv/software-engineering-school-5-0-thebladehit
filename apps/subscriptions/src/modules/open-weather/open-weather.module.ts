import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CityOpenWeatherService } from './city-open-weather.service';

@Module({
  imports: [HttpModule],
  providers: [CityOpenWeatherService],
  exports: [CityOpenWeatherService],
})
export class OpenWeatherModule {}
