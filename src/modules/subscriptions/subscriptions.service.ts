import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionRepository } from './contracts/subscription.repository';
import { MailService } from '../mail/contracts/mail.service';
import { Subscription, SubscriptionType } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly mailService: MailService
  ) {}

  getDailySubscribers(): Promise<Subscription[]> {
    return this.subscriptionRepository.getSubscription(SubscriptionType.DAILY);
  }

  getHourlySubscribers(): Promise<Subscription[]> {
    return this.subscriptionRepository.getSubscription(SubscriptionType.HOURLY);
  }

  async createSubscription(dto: CreateSubscriptionDto) {
    const existingSubscription =
      await this.subscriptionRepository.findDuplicateSubscription(dto);
    if (existingSubscription) {
      throw new ConflictException('You already subscribed to this city.');
    }
    const subscription =
      await this.subscriptionRepository.createSubscription(dto);
    this.mailService.sendSubscriptionConfirmation({
      email: dto.email,
      token: subscription.id,
      city: dto.city,
      frequency: dto.frequency,
    });
  }

  async confirmSubscription(token: string) {
    const subscription =
      await this.subscriptionRepository.findSubscriptionByToken(token);
    if (!subscription) {
      throw new NotFoundException('Subscription with such id does not exist');
    }
    if (subscription.isConfirmed) {
      throw new BadRequestException(
        'You have already confirm this subscription'
      );
    }
    await this.subscriptionRepository.confirmSubscription(token);
  }

  async unsubscribeSubscription(token: string) {
    const subscription =
      await this.subscriptionRepository.findSubscriptionByToken(token);
    if (!subscription) {
      throw new NotFoundException('Subscription with such id does not exist');
    }
    await this.deleteSubscription(token);
  }

  deleteSubscription(token: string) {
    return this.subscriptionRepository.deleteSubscription(token)
  }
}
