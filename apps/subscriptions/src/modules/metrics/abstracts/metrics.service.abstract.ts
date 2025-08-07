export abstract class AbstractSubscriptionMetricsService {
  abstract incExternalRequest(provider: string): void;
}
