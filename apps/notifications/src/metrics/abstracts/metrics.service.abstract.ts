export abstract class AbstractNotificationMetricsService {
  abstract incEmailSent(status: string, emailType: string): void;
}
