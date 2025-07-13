import { CreateSubscriptionDto } from '@app/common/types';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subscription, SubscriptionType } from '@prisma/client';

import { CityService } from '../city/city.service';
import { AbstractNotificationsService } from '../notifications/abstracts/notifications.abstract';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { SubscriptionWithUserAndCity } from './types/subscription-with-user-city';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: AbstractSubscriptionRepository,
    private readonly cityService: CityService,
    private readonly notificationsService: AbstractNotificationsService
  ) {}

  getDailySubscribers(
    batchSize: number,
    lastId?: string
  ): Promise<SubscriptionWithUserAndCity[]> {
    return this.subscriptionRepository.getSubscriptions(
      SubscriptionType.DAILY,
      batchSize,
      lastId
    );
  }

  getHourlySubscribers(
    batchSize: number,
    lastId?: string
  ): Promise<SubscriptionWithUserAndCity[]> {
    return this.subscriptionRepository.getSubscriptions(
      SubscriptionType.HOURLY,
      batchSize,
      lastId
    );
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<void> {
    const isDuplicate =
      await this.subscriptionRepository.isDuplicateSubscription(dto);
    if (isDuplicate) {
      throw new ConflictException('You already subscribed to this city.');
    }
    const cityId = await this.cityService.getCityId(dto.city);
    const subscription = await this.subscriptionRepository.createSubscription(
      dto,
      cityId
    );
    await this.notificationsService.sendSubscriptionConfirmation({
      email: dto.email,
      token: subscription.id,
      city: dto.city,
      frequency: dto.frequency,
    });
  }

  async confirmSubscription(token: string): Promise<void> {
    const subscription =
      await this.subscriptionRepository.findSubscriptionByToken(token);
    if (!subscription) {
      throw new NotFoundException('Subscription with such id does not exist');
    }
    if (subscription.isConfirmed) {
      throw new BadRequestException(
        'You have already confirm this subscriptions'
      );
    }
    await this.subscriptionRepository.confirmSubscription(token);
  }

  async unsubscribeSubscription(token: string): Promise<void> {
    const subscription =
      await this.subscriptionRepository.findSubscriptionByToken(token);
    if (!subscription) {
      throw new NotFoundException('Subscription with such id does not exist');
    }
    await this.deleteSubscription(token);
  }

  deleteSubscription(token: string): Promise<Subscription> {
    return this.subscriptionRepository.deleteSubscription(token);
  }
}
