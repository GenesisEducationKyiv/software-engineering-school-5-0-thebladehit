import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

import { TotalRequestsInterceptor } from '@app/common/interceptors/total-requests.interceptor';
import { AbstractMetricsService } from '@app/common/metrics/abstracts';

import {
  GRPC_REQUEST_TOTAL,
  HTTP_REQUEST_TOTAL,
} from './constants/metrics-name';
import { MetricsService } from './metrics.service';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    {
      provide: AbstractMetricsService,
      useClass: MetricsService,
    },
    makeCounterProvider({
      name: HTTP_REQUEST_TOTAL,
      help: 'Total count of http requests',
      labelNames: ['method', 'route'],
    }),
    makeCounterProvider({
      name: GRPC_REQUEST_TOTAL,
      help: 'Total count of gRPC requests',
      labelNames: ['handler'],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: TotalRequestsInterceptor,
    },
  ],
  exports: [AbstractMetricsService],
})
export class MetricsModule {}
