import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';
import { CityRepository } from './city.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: AbstractCityRepository,
      useClass: CityRepository,
    },
  ],
  exports: [AbstractCityRepository],
})
export class CityModule {}
