import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { AbstractMetricsService } from '@app/common/metrics/abstracts';

import {
  GRPC_REQUEST_TOTAL,
  HTTP_REQUEST_TOTAL,
} from './constants/metrics-name';

@Injectable()
export class MetricsService implements AbstractMetricsService {
  constructor(
    @InjectMetric(HTTP_REQUEST_TOTAL) private readonly httpRequests: Counter,
    @InjectMetric(GRPC_REQUEST_TOTAL) private readonly grpcRequests: Counter
  ) {}

  incGrpcCall(handler: string): void {
    this.grpcRequests.inc({ handler });
  }

  incHttpCall(method: string, route: string): void {
    this.httpRequests.inc({ method, route });
  }
}
