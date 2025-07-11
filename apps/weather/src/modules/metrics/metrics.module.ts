import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

import { AbstractMetricsService } from './abstracts/metrics.service.abstract';
import { DATA_FROM_API, DATA_FROM_REDIS_CACHE } from './constants/metric-names';
import { MetricsService } from './metrics.service';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    {
      provide: AbstractMetricsService,
      useClass: MetricsService,
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
  exports: [AbstractMetricsService],
})
export class MetricsModule {}
