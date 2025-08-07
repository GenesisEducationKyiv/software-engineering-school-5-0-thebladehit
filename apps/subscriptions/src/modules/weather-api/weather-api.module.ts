import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MetricsModule } from '../metrics/metrics.module';

import { CityWeatherApiService } from './city-weather-api.service';

@Module({
  imports: [HttpModule, MetricsModule],
  providers: [CityWeatherApiService],
  exports: [CityWeatherApiService],
})
export class WeatherApiModule {}
