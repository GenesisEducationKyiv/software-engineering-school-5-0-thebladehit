import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AbstractCityApiService } from '../abstracts/city-api.abstract';
import { CityOpenWeatherService } from '../open-weather/city-open-weather.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CityWeatherApiService } from '../weather-api/city-weather-api.service';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';
import { CityApiChainService } from './city-api-chain.service';
import { CityRepository } from './city.repository';
import { CityService } from './city.service';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [
    CityService,
    CityWeatherApiService,
    CityOpenWeatherService,
    {
      provide: AbstractCityRepository,
      useClass: CityRepository,
    },
    {
      provide: AbstractCityApiService,
      useFactory: (
        cityWeatherApiService: CityWeatherApiService,
        cityOpenWeatherService: CityOpenWeatherService
      ): AbstractCityApiService => {
        return new CityApiChainService(
          cityWeatherApiService,
          cityOpenWeatherService
        );
      },
      inject: [CityWeatherApiService, CityOpenWeatherService],
    },
  ],
  exports: [CityService],
})
export class CityModule {}
