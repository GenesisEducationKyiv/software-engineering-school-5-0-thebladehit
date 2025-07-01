import { Injectable, NotFoundException } from '@nestjs/common';

import { AbstractCityApiService } from '../../abstracts/city-api.abstract';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: AbstractCityRepository,
    private readonly cityApiService: AbstractCityApiService
  ) {}

  async getCityId(name: string): Promise<string> {
    const cityInDB = await this.cityRepository.getCity(name);
    if (cityInDB) {
      return cityInDB.id;
    }
    const isCityExists = await this.cityApiService.isCityExists(name);
    if (!isCityExists) {
      throw new NotFoundException(`City ${name} not found`);
    }
    const city = await this.cityRepository.createCity(name);
    return city.id;
  }
}
