import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MetricsModule } from '../metrics/metrics.module';

import { WeatherAPIService } from './weather-api.service';

@Module({
  imports: [HttpModule, MetricsModule],
  providers: [WeatherAPIService],
  exports: [WeatherAPIService],
})
export class WeatherApiModule {}
