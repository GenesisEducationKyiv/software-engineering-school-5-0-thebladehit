import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MetricsModule } from '../metrics/metrics.module';

import { CityOpenWeatherService } from './city-open-weather.service';

@Module({
  imports: [HttpModule, MetricsModule],
  providers: [CityOpenWeatherService],
  exports: [CityOpenWeatherService],
})
export class OpenWeatherModule {}
