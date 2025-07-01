import { Injectable } from '@nestjs/common';

import { AbstractCityApiService } from '../../abstracts/city-api.abstract';

import { AbstractCityApiChainService } from './abstracts/city-api-chain.abstract';
import { CityOpenWeatherProvider } from './chain-providers/city-open-weather.provider';
import { CityWeatherApiProvider } from './chain-providers/city-weather-api.provider';

@Injectable()
export class CityApiChainService implements AbstractCityApiService {
  private readonly providerChain: AbstractCityApiChainService;

  constructor(
    private readonly cityWeatherApiProvider: CityWeatherApiProvider,
    private readonly cityOpenWeatherProvider: CityOpenWeatherProvider
  ) {
    this.providerChain = this.cityWeatherApiProvider;
    this.providerChain.setNext(this.cityOpenWeatherProvider);
  }

  isCityExists(name: string): Promise<boolean> {
    return this.providerChain.isCityExists(name);
  }
}
