import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MetricsModule } from '../metrics/metrics.module';

import { OpenWeatherService } from './open-weather.service';

@Module({
  imports: [HttpModule, MetricsModule],
  providers: [OpenWeatherService],
  exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
