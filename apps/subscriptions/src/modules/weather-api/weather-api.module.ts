import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CityWeatherApiService } from './city-weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [CityWeatherApiService],
  exports: [CityWeatherApiService],
})
export class WeatherApiModule {}
