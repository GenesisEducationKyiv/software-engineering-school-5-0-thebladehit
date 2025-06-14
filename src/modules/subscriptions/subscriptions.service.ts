import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subscription, SubscriptionType } from '@prisma/client';

import { CityService } from '../city/city.service';
import { AbstractMailService } from '../mail/abstracts/mail.service.abstract';

import { AbstractSubscriptionRepository } from './abstracts/subscription.repository.abstract';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionWithUserAndCity } from './types/subscription-restult';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: AbstractSubscriptionRepository,
    private readonly cityService: CityService,
    private readonly mailService: AbstractMailService
  ) {}

  getDailySubscribers(): Promise<SubscriptionWithUserAndCity[]> {
    return this.subscriptionRepository.getSubscriptions(SubscriptionType.DAILY);
  }

  getHourlySubscribers(): Promise<SubscriptionWithUserAndCity[]> {
    return this.subscriptionRepository.getSubscriptions(
      SubscriptionType.HOURLY
    );
  }

  async createSubscription(dto: CreateSubscriptionDto): Promise<void> {
    const isDuplicate =
      await this.subscriptionRepository.isDuplicateSubscription(dto);
    if (isDuplicate) {
      throw new ConflictException('You already subscribed to this city.');
    }
    await this.cityService.validateCity(dto.city);
    const subscription =
      await this.subscriptionRepository.createSubscription(dto);
    await this.mailService.sendSubscriptionConfirmation({
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
