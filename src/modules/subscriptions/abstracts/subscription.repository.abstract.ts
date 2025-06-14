import { Subscription, SubscriptionType } from '@prisma/client';

import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export abstract class AbstractSubscriptionRepository {
  abstract getSubscriptions(type: SubscriptionType): Promise<Subscription[]>;
  abstract findSubscriptionByToken(token: string): Promise<Subscription>;
  abstract isDuplicateSubscription(
    dto: CreateSubscriptionDto
  ): Promise<boolean>;
  abstract createSubscription(
    dto: CreateSubscriptionDto
  ): Promise<Subscription>;
  abstract confirmSubscription(token: string): Promise<Subscription>;
  abstract deleteSubscription(token: string): Promise<Subscription>;
}
