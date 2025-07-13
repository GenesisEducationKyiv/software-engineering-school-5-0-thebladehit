import { CreateSubscriptionDto } from '@app/common/types';
import { Subscription, SubscriptionType } from '@prisma/client';

import { SubscriptionWithUserAndCity } from '../types/subscription-with-user-city';

export abstract class AbstractSubscriptionRepository {
  abstract getSubscriptions(
    type: SubscriptionType,
    batchSize: number,
    lastId?: string
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
