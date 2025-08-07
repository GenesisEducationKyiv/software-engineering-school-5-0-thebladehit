import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

import { AbstractNotificationMetricsService } from './abstracts/metrics.service.abstract';
import { EMAIL_SENT } from './constants/metrics-name';

@Injectable()
export class NotificationsMetricsService
  implements AbstractNotificationMetricsService
{
  constructor(@InjectMetric(EMAIL_SENT) private readonly emailSent: Counter) {}

  incEmailSent(status: string, emailType: string): void {
    this.emailSent.inc({ status, emailType });
  }
}
