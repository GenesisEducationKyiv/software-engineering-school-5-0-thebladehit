import { Module } from '@nestjs/common';

import { AbstractCityApiService } from '../abstracts/city-api.abstract';
import { PrismaModule } from '../prisma/prisma.module';
import { CityApiService } from '../weather-api/city-api.service';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';
import { CityRepository } from './city.repository';
import { CityService } from './city.service';

@Module({
  imports: [PrismaModule],
  providers: [
    CityService,
    {
      provide: AbstractCityRepository,
      useClass: CityRepository,
    },
    {
      provide: AbstractCityApiService,
      useClass: CityApiService,
    },
  ],
  exports: [CityService],
})
export class CityModule {}
