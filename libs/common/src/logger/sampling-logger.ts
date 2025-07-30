import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { createWinstonConfig } from '@app/common/logger/winston.config';

export class SamplingLogger implements LoggerService {
  private readonly logger: LoggerService;

  constructor(appName: string) {
    this.logger = WinstonModule.createLogger(createWinstonConfig(appName));
  }

  private shouldLog(probability: number): boolean {
    return Math.random() < probability;
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.error(message, ...optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.fatal(message, ...optionalParams);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    if (this.shouldLog(0.7)) {
      this.logger.log(message, ...optionalParams);
    }
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    if (this.shouldLog(0.1)) {
      this.logger.verbose(message, ...optionalParams);
    }
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    if (this.shouldLog(0.6)) {
      this.logger.warn(message, ...optionalParams);
    }
  }
}
