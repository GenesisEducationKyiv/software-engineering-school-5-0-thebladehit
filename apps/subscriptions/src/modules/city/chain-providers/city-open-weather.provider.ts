import { Injectable } from '@nestjs/common';

import { CityOpenWeatherService } from '../../open-weather/city-open-weather.service';

import { BaseCityProvider } from './base-city.provider';

@Injectable()
export class CityOpenWeatherProvider extends BaseCityProvider {
  constructor(private readonly cityOpenWeatherService: CityOpenWeatherService) {
    super();
  }

  protected handleIsCityExists(name: string): Promise<boolean> {
    return this.cityOpenWeatherService.isCityExists(name);
  }
}
