import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { AbstractMetricsService } from './abstracts/metrics.service.abstract';
import { DATA_FROM_API, DATA_FROM_REDIS_CACHE } from './constants/metric-names';

@Injectable()
export class MetricsService implements AbstractMetricsService {
  constructor(
    @InjectMetric(DATA_FROM_REDIS_CACHE)
    private readonly dataFromRedisCache: Counter,
    @InjectMetric(DATA_FROM_API)
    private readonly dataFromApi: Counter
  ) {}

  incFromCache(): void {
    this.dataFromRedisCache.inc();
  }

  incFromApi(): void {
    this.dataFromApi.inc();
  }
}
