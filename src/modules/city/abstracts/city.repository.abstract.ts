export abstract class AbstractCityRepository {
  abstract isCityExists(city: string): Promise<boolean>;
}
