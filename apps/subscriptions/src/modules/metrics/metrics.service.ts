import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { AbstractSubscriptionMetricsService } from './abstracts/metrics.service.abstract';
import { EXTERNAL_REQUESTS_TOTAL } from './constants/metrics-name';

@Injectable()
export class SubscriptionsMetricsService
  implements AbstractSubscriptionMetricsService
{
  constructor(
    @InjectMetric(EXTERNAL_REQUESTS_TOTAL)
    private readonly externalRequests: Counter
  ) {}

  incExternalRequest(provider: string): void {
    this.externalRequests.inc({ provider });
  }
}
