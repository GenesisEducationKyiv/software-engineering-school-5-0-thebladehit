import { Injectable } from '@nestjs/common';
import { Subscription, SubscriptionType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionWithUserAndCity } from './types/subscription-with-user-city';

@Injectable()
export class SubscriptionRepository implements AbstractSubscriptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getSubscriptions(
    type: SubscriptionType
  ): Promise<SubscriptionWithUserAndCity[]> {
    return this.prismaService.subscription.findMany({
      where: {
        type,
        isConfirmed: true,
      },
      include: {
        user: {
          select: { email: true },
        },
        city: {
          select: { name: true },
        },
      },
    });
  }

  findSubscriptionByToken(token: string): Promise<Subscription> {
    return this.prismaService.subscription.findUnique({
      where: { id: token },
    });
  }

  async isDuplicateSubscription(dto: CreateSubscriptionDto): Promise<boolean> {
    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        type: dto.frequency,
        city: { name: dto.city },
        user: { email: dto.email },
      },
      select: { id: true },
    });
    return Boolean(subscription);
  }

  createSubscription(dto: CreateSubscriptionDto): Promise<Subscription> {
    return this.prismaService.subscription.create({
      data: {
        type: dto.frequency,
        city: {
          connectOrCreate: {
            create: { name: dto.city },
            where: { name: dto.city },
          },
        },
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
