import { Module } from '@nestjs/common';

import { AbstractCityApiService } from '../../abstracts/city-api.abstract';
import { OpenWeatherModule } from '../open-weather/open-weather.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WeatherApiModule } from '../weather-api/weather-api.module';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';
import { CityOpenWeatherProvider } from './chain-providers/city-open-weather.provider';
import { CityWeatherApiProvider } from './chain-providers/city-weather-api.provider';
import { CityApiChainService } from './city-api-chain.service';
import { CityRepository } from './city.repository';
import { CityService } from './city.service';

@Module({
  imports: [PrismaModule, WeatherApiModule, OpenWeatherModule],
  providers: [
    CityService,
    CityWeatherApiProvider,
    CityOpenWeatherProvider,
    {
      provide: AbstractCityRepository,
      useClass: CityRepository,
    },
    {
      provide: AbstractCityApiService,
      useClass: CityApiChainService,
    },
  ],
  exports: [CityService],
})
export class CityModule {}
