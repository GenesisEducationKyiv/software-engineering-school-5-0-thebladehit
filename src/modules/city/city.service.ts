import { Injectable, NotFoundException } from '@nestjs/common';

import { AbstractCityApiService } from '../abstracts/city-api.abstract';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: AbstractCityRepository,
    private readonly cityApiService: AbstractCityApiService
  ) {}

  async getCityId(name: string): Promise<string> {
    const cityName = name.toLowerCase();
    const cityInDB = await this.cityRepository.getCity(cityName);
    if (cityInDB) {
      return cityInDB.id;
    }
    const isCityExists = await this.cityApiService.isCityExists(cityName);
    if (!isCityExists) {
      throw new NotFoundException(`City ${cityName} not found`);
    }
    const city = await this.cityRepository.createCity(cityName);
    return city.id;
  }
}
