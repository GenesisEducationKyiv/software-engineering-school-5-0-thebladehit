import { Injectable, NotFoundException } from '@nestjs/common';

import { AbstractCityApiService } from '../abstracts/city-api.abstract';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: AbstractCityRepository,
    private readonly cityApiService: AbstractCityApiService
  ) {}

  async validateCity(name: string): Promise<void | never> {
    const isCityInDB = await this.cityRepository.isCityExists(name);
    if (isCityInDB) {
      return;
    }
    const isCityExists = await this.cityApiService.isCityExists(name);
    if (!isCityExists) {
      throw new NotFoundException(`City ${name} not found`);
    }
  }
}
