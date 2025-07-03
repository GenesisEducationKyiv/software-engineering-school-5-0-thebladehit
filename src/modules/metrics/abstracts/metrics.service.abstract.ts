export abstract class AbstractMetricsService {
  abstract incFromCache(): void;
  abstract incFromApi(): void;
}
