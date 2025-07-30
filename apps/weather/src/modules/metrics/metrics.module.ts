import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

import { MetricsModule as CommonMetricsModule } from '@app/common/metrics';

import { AbstractWeatherMetricsService } from './abstracts/weather-metrics.service.abstract';
import { DATA_FROM_API, DATA_FROM_REDIS_CACHE } from './constants/metric-names';
import { WeatherMetricsService } from './weather-metrics.service';

@Module({
  imports: [CommonMetricsModule],
  providers: [
    {
      provide: AbstractWeatherMetricsService,
      useClass: WeatherMetricsService,
    },
    makeCounterProvider({
      name: DATA_FROM_REDIS_CACHE,
      help: 'Data gotten from redis cache',
    }),
    makeCounterProvider({
      name: DATA_FROM_API,
      help: 'Data gotten from external api',
    }),
  ],
  exports: [AbstractWeatherMetricsService],
})
export class MetricsModule {}
