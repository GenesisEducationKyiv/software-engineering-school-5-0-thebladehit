import { Subscription, SubscriptionType } from '@prisma/client';

import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionWithUserAndCity } from '../types/subscription-with-user-city';

export abstract class AbstractSubscriptionRepository {
  abstract getSubscriptions(
    type: SubscriptionType
  ): Promise<SubscriptionWithUserAndCity[]>;
  abstract findSubscriptionByToken(token: string): Promise<Subscription>;
  abstract isDuplicateSubscription(
    dto: CreateSubscriptionDto
  ): Promise<boolean>;
  abstract createSubscription(
    dto: CreateSubscriptionDto,
    cityId: string
  ): Promise<Subscription>;
  abstract confirmSubscription(token: string): Promise<Subscription>;
  abstract deleteSubscription(token: string): Promise<Subscription>;
}
