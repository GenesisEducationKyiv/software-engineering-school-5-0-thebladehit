import { Subscription } from '@prisma/client';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export abstract class SubscriptionRepository {
  abstract findSubscriptionByToken(token: string): Promise<Subscription>;
  abstract findDuplicateSubscription(dto: CreateSubscriptionDto): Promise<Subscription>;
  abstract createSubscription(dto: CreateSubscriptionDto): Promise<Subscription>;
  abstract confirmSubscription(token: string): Promise<Subscription>;
  abstract deleteSubscription(token: string): Promise<Subscription>;
}
