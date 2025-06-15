import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AbstractCityRepository } from './abstracts/city.repository.abstract';

@Injectable()
export class CityRepository implements AbstractCityRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async isCityExists(name: string): Promise<boolean> {
    const city = await this.prismaService.city.findUnique({
      where: { name },
      select: { id: true },
    });
    return Boolean(city);
  }
}
