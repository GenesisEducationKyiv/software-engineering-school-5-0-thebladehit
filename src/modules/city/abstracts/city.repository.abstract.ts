import { City } from '@prisma/client';

export abstract class AbstractCityRepository {
  abstract getCity(city: string): Promise<City>;
  abstract createCity(city: string): Promise<City>;
}
