export abstract class AbstractWeatherMetricsService {
  abstract incFromCache(): void;
  abstract incFromApi(): void;
}
