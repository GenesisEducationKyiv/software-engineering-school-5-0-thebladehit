export abstract class AbstractCityApiService {
  abstract isCityExists(name: string): Promise<boolean>;
}