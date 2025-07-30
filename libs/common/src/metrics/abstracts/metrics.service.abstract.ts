export abstract class AbstractMetricsService {
  abstract incGrpcCall(handler: string): void;
  abstract incHttpCall(method: string, route: string): void;
}
