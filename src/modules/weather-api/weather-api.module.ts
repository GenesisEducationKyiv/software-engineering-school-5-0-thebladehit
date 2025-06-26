import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CityWeatherApiService } from './city-weather-api.service';
import { WeatherAPIService } from './weather-api.service';

@Module({
  imports: [HttpModule],
  providers: [WeatherAPIService, CityWeatherApiService],
  exports: [WeatherAPIService, CityWeatherApiService],
})
export class WeatherApiModule {}
