import { Injectable } from '@nestjs/common';
import { City } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';

@Injectable()
export class CityRepository implements AbstractCityRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createCity(city: string): Promise<City> {
    return this.prismaService.city.create({
      data: { name: city },
    });
  }

  getCity(name: string): Promise<City> {
    return this.prismaService.city.findUnique({
      where: { name },
    });
  }
}
