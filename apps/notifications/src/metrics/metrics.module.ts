import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

import { AbstractNotificationMetricsService } from './abstracts/metrics.service.abstract';
import { EMAIL_SENT } from './constants/metrics-name';
import { NotificationsMetricsService } from './metrics.service';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    {
      provide: AbstractNotificationMetricsService,
      useClass: NotificationsMetricsService,
    },
    makeCounterProvider({
      name: EMAIL_SENT,
      help: 'The total sent email count',
      labelNames: ['status', 'emailType'],
    }),
  ],
  exports: [AbstractNotificationMetricsService],
})
export class MetricsModule {}
