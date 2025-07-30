import { MetricsModule as CommonMetricsModule } from '@app/common/metrics';
import { Module } from '@nestjs/common';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

import { AbstractSubscriptionMetricsService } from './abstracts/metrics.service.abstract';
import { EXTERNAL_REQUESTS_TOTAL } from './constants/metrics-name';
import { SubscriptionsMetricsService } from './metrics.service';

@Module({
  imports: [CommonMetricsModule],
  providers: [
    {
      provide: AbstractSubscriptionMetricsService,
      useClass: SubscriptionsMetricsService,
    },
    makeCounterProvider({
      name: EXTERNAL_REQUESTS_TOTAL,
      help: 'The total external requests',
      labelNames: ['provider'],
    }),
  ],
  exports: [AbstractSubscriptionMetricsService],
})
export class MetricsModule {}
