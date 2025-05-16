import { SubscriptionRepository } from './contracts/subscription.repository';
import { Subscription } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionRepositoryImpl implements SubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findSubscriptionByToken(token: string): Promise<Subscription> {
    return this.prismaService.subscription.findUnique({
      where: { id: token },
    });
  }

  findDuplicateSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.prismaService.subscription.findFirst({
      where: {
        type: dto.frequency,
        city: dto.city,
        user: { email: dto.email },
      },
    });
  }

  createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.prismaService.subscription.create({
      data: {
        type: dto.frequency,
        city: dto.city,
        user: {
          connectOrCreate: {
            where: { email: dto.email },
            create: { email: dto.email },
          },
        },
      },
    });
  }

  confirmSubscription(token: string): Promise<Subscription> {
    return this.prismaService.subscription.update({
      where: { id: token },
      data: { isConfirmed: true },
    });
  }

  deleteSubscription(token: string): Promise<Subscription> {
    return this.prismaService.subscription.delete({
      where: { id: token },
    });
  }
}
