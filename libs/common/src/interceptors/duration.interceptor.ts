import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DurationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DurationInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();

    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      const method = req.method;
      const url = req.url;

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - now;

          this.logger.log(
            JSON.stringify({
              type: 'http',
              method,
              url,
              duration: `${duration} ms`,
            })
          );
        })
      );
    }

    if (context.getType() === 'rpc') {
      const handler = context.getHandler().name;
      const rpcContext = context.switchToRpc();
      const data = rpcContext.getData();

      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - now;
          this.logger.log(
            JSON.stringify({
              type: 'grpc',
              handler,
              payload: data,
              duration: `${duration}ms`,
            })
          );
        })
      );
    }
  }
}
