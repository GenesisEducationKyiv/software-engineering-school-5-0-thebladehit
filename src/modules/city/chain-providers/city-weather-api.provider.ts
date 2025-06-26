import { Injectable } from '@nestjs/common';

import { CityWeatherApiService } from '../../weather-api/city-weather-api.service';

import { BaseCityProvider } from './base-city.provider';

@Injectable()
export class CityWeatherApiProvider extends BaseCityProvider {
  constructor(private readonly cityWeatherApiService: CityWeatherApiService) {
    super();
  }

  protected handleIsCityExists(name: string): Promise<boolean> {
    return this.cityWeatherApiService.isCityExists(name);
  }
}
