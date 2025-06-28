import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

import { DATA_FROM_API, DATA_FROM_REDIS_CACHE } from './constance/metric-names';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: false,
      },
    }),
  ],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: DATA_FROM_REDIS_CACHE,
      help: 'Data gotten from redis cache',
    }),
    makeCounterProvider({
      name: DATA_FROM_API,
      help: 'Data gotten from external api',
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
