import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AbstractMetricsService } from '../metrics/abstracts/metrics.service.abstract';

@Injectable()
export class TotalRequestsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: AbstractMetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const method = req.method;
      const url = req.route?.path || req.url;
      this.metrics.incHttpCall(method, url);
    }

    if (context.getType() === 'rpc') {
      const handler = context.getHandler().name;
      this.metrics.incGrpcCall(handler);
    }
    return next.handle();
  }
}
